"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrKey = exports.Server = exports.Networks = exports.Asset = exports.StellarPaymentService = void 0;
exports.createStellarPaymentService = createStellarPaymentService;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const { Server } = stellar_sdk_1.Horizon;
class StellarPaymentService {
    network;
    horizonUrl;
    sourcePublicKey;
    sourceSecret;
    server;
    constructor(config) {
        this.network = config.network || "testnet";
        this.horizonUrl = config.horizonUrl || "https://horizon-testnet.stellar.org";
        this.sourcePublicKey = config.sourcePublicKey;
        this.sourceSecret = config.sourceSecret;
        this.server = new Server(this.horizonUrl);
    }
    getNetwork() {
        return this.network;
    }
    validateDestination(address) {
        return Boolean(address && stellar_sdk_1.StrKey.isValidEd25519PublicKey(address));
    }
    async checkSourceAccount(publicKey) {
        if (!publicKey) {
            throw new Error("Source public key is required.");
        }
        return this.server.loadAccount(publicKey);
    }
    async checkBalance(publicKey) {
        const account = await this.checkSourceAccount(publicKey);
        return account.balances.map((balance) => ({
            balance: balance.balance,
            asset: balance.asset_type === "native" ? "XLM" : balance.asset_code ?? balance.asset_type,
        }));
    }
    buildPaymentTransaction(input) {
        if (!this.validateDestination(input.destination)) {
            throw new Error("Destination Stellar address is invalid.");
        }
        const networkPassphrase = this.network === "public" ? stellar_sdk_1.Networks.PUBLIC : stellar_sdk_1.Networks.TESTNET;
        const sourceAsset = input.assetCode === "XLM" || !input.assetCode ? stellar_sdk_1.Asset.native() : new stellar_sdk_1.Asset(input.assetCode, input.sourcePublicKey);
        return new stellar_sdk_1.TransactionBuilder({ accountId: input.sourcePublicKey, sequence: "0" }, {
            fee: "100",
            networkPassphrase,
        })
            .addOperation(stellar_sdk_1.Horizon.Operation.payment({
            destination: input.destination,
            asset: sourceAsset,
            amount: input.amount,
        }))
            .setTimeout(30)
            .build();
    }
    signTransaction(transactionXdr, secretKey) {
        const keypair = stellar_sdk_1.Keypair.fromSecret(secretKey);
        const transaction = stellar_sdk_1.xdr.TransactionEnvelope.fromXDR(transactionXdr, "base64");
        return transaction.sign(keypair);
    }
    async submitTransaction(signedTransaction) {
        if (!signedTransaction) {
            throw new Error("Signed transaction is required.");
        }
        const tx = stellar_sdk_1.xdr.TransactionEnvelope.fromXDR(signedTransaction, "base64");
        const response = await this.server.submitTransaction(tx);
        return { hash: response.hash, status: response.successful ? "SUCCESS" : "FAILED" };
    }
    async lookupTransaction(hash) {
        return this.server.transactions().transaction(hash).call();
    }
}
exports.StellarPaymentService = StellarPaymentService;
function createStellarPaymentService(env = process.env) {
    return new StellarPaymentService({
        network: env.STELLAR_NETWORK ?? "testnet",
        horizonUrl: env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
        sourcePublicKey: env.STELLAR_SOURCE_PUBLIC_KEY,
        sourceSecret: env.STELLAR_SOURCE_SECRET,
    });
}
var stellar_sdk_2 = require("@stellar/stellar-sdk");
Object.defineProperty(exports, "Asset", { enumerable: true, get: function () { return stellar_sdk_2.Asset; } });
Object.defineProperty(exports, "Networks", { enumerable: true, get: function () { return stellar_sdk_2.Networks; } });
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return stellar_sdk_2.Server; } });
Object.defineProperty(exports, "StrKey", { enumerable: true, get: function () { return stellar_sdk_2.StrKey; } });
