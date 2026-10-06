import { Account, Asset, Horizon, Keypair, Networks, Operation, StrKey, TransactionBuilder } from "@stellar/stellar-sdk";

const { Server } = Horizon;

export interface StellarConfig {
  network: string;
  horizonUrl: string;
  sourcePublicKey?: string;
  sourceSecret?: string;
}

export class StellarPaymentService {
  private readonly network: string;
  private readonly horizonUrl: string;
  private readonly sourcePublicKey?: string;
  private readonly sourceSecret?: string;
  private readonly server: any;

  constructor(config: StellarConfig) {
    this.network = config.network || "testnet";
    this.horizonUrl = config.horizonUrl || "https://horizon-testnet.stellar.org";
    this.sourcePublicKey = config.sourcePublicKey;
    this.sourceSecret = config.sourceSecret;
    this.server = new Server(this.horizonUrl);
  }

  getNetwork(): string {
    return this.network;
  }

  validateDestination(address: string): boolean {
    return Boolean(address && StrKey.isValidEd25519PublicKey(address));
  }

  async checkSourceAccount(publicKey: string): Promise<any> {
    if (!publicKey) {
      throw new Error("Source public key is required.");
    }

    return this.server.loadAccount(publicKey);
  }

  async checkBalance(publicKey: string): Promise<{ balance: string; asset: string }[]> {
    const account = await this.checkSourceAccount(publicKey);
    return account.balances.map((balance: any) => ({
      balance: balance.balance,
      asset: balance.asset_type === "native" ? "XLM" : balance.asset_code ?? balance.asset_type,
    }));
  }

  buildPaymentTransaction(input: {
    sourcePublicKey: string;
    destination: string;
    amount: string;
    assetCode?: string;
  }) {
    if (!this.validateDestination(input.destination)) {
      throw new Error("Destination Stellar address is invalid.");
    }

    const networkPassphrase = this.network === "public" ? Networks.PUBLIC : Networks.TESTNET;
    const sourceAsset = input.assetCode === "XLM" || !input.assetCode ? Asset.native() : new Asset(input.assetCode, input.sourcePublicKey);

    return new TransactionBuilder(new Account(input.sourcePublicKey, "0"), {
      fee: "100",
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: input.destination,
          asset: sourceAsset,
          amount: input.amount,
        }),
      )
      .setTimeout(30)
      .build();
  }

  signTransaction(transaction: any, secretKey: string) {
    const keypair = Keypair.fromSecret(secretKey);
    return transaction.sign(keypair);
  }

  async submitTransaction(signedTransaction: any) {
    if (!signedTransaction) {
      throw new Error("Signed transaction is required.");
    }

    const response = await this.server.submitTransaction(signedTransaction);
    return { hash: response.hash, status: response.successful ? "SUCCESS" : "FAILED" };
  }

  async lookupTransaction(hash: string) {
    return this.server.transactions().transaction(hash).call();
  }
}

export function createStellarPaymentService(env: NodeJS.ProcessEnv = process.env): StellarPaymentService {
  return new StellarPaymentService({
    network: env.STELLAR_NETWORK ?? "testnet",
    horizonUrl: env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
    sourcePublicKey: env.STELLAR_SOURCE_PUBLIC_KEY,
    sourceSecret: env.STELLAR_SOURCE_SECRET,
  });
}

export { Asset, Networks, StrKey } from "@stellar/stellar-sdk";
export * from "./escrow";
