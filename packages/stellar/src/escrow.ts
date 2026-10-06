import {
  Account,
  Address,
  Contract,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

export const TESTNET_RPC_URL = "https://soroban-testnet.stellar.org";

export type MilestoneStatus = "Pending" | "Submitted" | "Released" | "Refunded";

export interface EscrowMilestone {
  amount: bigint;
  deadline: bigint;
  status: MilestoneStatus;
}

export interface EscrowInfo {
  client: string;
  freelancer: string;
  token: string;
}

export type EscrowAction = "submit" | "release" | "claim" | "refund";

export interface EscrowClientConfig {
  contractId: string;
  rpcUrl?: string;
  networkPassphrase?: string;
}

/**
 * Thin client for the StellaTrust Soroban escrow contract (contracts/escrow).
 * It never holds keys: write calls return an unsigned, simulated transaction
 * (base64 XDR) for the user's wallet to sign.
 */
export class EscrowClient {
  private readonly contract: Contract;
  private readonly server: rpc.Server;
  private readonly networkPassphrase: string;

  constructor(config: EscrowClientConfig) {
    this.contract = new Contract(config.contractId);
    this.networkPassphrase = config.networkPassphrase ?? Networks.TESTNET;
    this.server = new rpc.Server(config.rpcUrl ?? TESTNET_RPC_URL);
  }

  get contractId(): string {
    return this.contract.contractId();
  }

  /** Build an unsigned invocation without touching the network. */
  buildInvocation(method: string, sourcePublicKey: string, args: xdr.ScVal[] = []) {
    return new TransactionBuilder(new Account(sourcePublicKey, "0"), {
      fee: "100",
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(this.contract.call(method, ...args))
      .setTimeout(30)
      .build();
  }

  /** Read all milestones via a simulated (free, unsigned) call. */
  async getMilestones(sourcePublicKey: string): Promise<EscrowMilestone[]> {
    const account = await this.server.getAccount(sourcePublicKey);
    const sim = await this.server.simulateTransaction(
      new TransactionBuilder(account, { fee: "100", networkPassphrase: this.networkPassphrase })
        .addOperation(this.contract.call("milestones"))
        .setTimeout(30)
        .build(),
    );
    if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) {
      throw new Error("Could not read escrow milestones from the contract.");
    }
    return decodeMilestones(sim.result.retval);
  }

  /**
   * Read the client, freelancer and token. Returns null when the contract has
   * no `info` function (older deployments) or is not initialized.
   */
  async getInfo(sourcePublicKey: string): Promise<EscrowInfo | null> {
    try {
      const account = await this.server.getAccount(sourcePublicKey);
      const sim = await this.server.simulateTransaction(
        new TransactionBuilder(account, { fee: "100", networkPassphrase: this.networkPassphrase })
          .addOperation(this.contract.call("info"))
          .setTimeout(30)
          .build(),
      );
      if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) return null;
      return decodeInfo(sim.result.retval);
    } catch {
      return null;
    }
  }

  /** Prepare a milestone action for the connected wallet to sign. */
  async prepareAction(action: EscrowAction, sourcePublicKey: string, milestoneIndex: number): Promise<string> {
    if (!Number.isInteger(milestoneIndex) || milestoneIndex < 0) {
      throw new Error("Milestone index must be a non-negative integer.");
    }
    const account = await this.server.getAccount(sourcePublicKey);
    const tx = new TransactionBuilder(account, { fee: "100", networkPassphrase: this.networkPassphrase })
      .addOperation(this.contract.call(action, nativeToScVal(milestoneIndex, { type: "u32" })))
      .setTimeout(30)
      .build();
    const prepared = await this.server.prepareTransaction(tx);
    return prepared.toXDR();
  }

  async submitSigned(signedXdr: string): Promise<{ hash: string }> {
    const tx = TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase);
    const res = await this.server.sendTransaction(tx);
    if (res.status === "ERROR") {
      throw new Error("Escrow transaction was rejected by the network.");
    }
    return { hash: res.hash };
  }
}

export function decodeMilestones(value: xdr.ScVal): EscrowMilestone[] {
  const native = scValToNative(value) as Array<{ amount: bigint; deadline: bigint; status: unknown }>;
  return native.map((m) => ({
    amount: BigInt(m.amount),
    deadline: BigInt(m.deadline),
    status: (Array.isArray(m.status) ? m.status[0] : m.status) as MilestoneStatus,
  }));
}

export function isValidContractId(id: string): boolean {
  try {
    Address.fromString(id);
    return id.startsWith("C");
  } catch {
    return false;
  }
}

/**
 * Which actions the contract will accept for a milestone right now, mirroring
 * the checks in contracts/escrow. Role (client vs freelancer) is not checked
 * here; the contract enforces it via require_auth.
 */
export function availableActions(milestone: EscrowMilestone, nowSeconds: number): EscrowAction[] {
  const pastDeadline = BigInt(Math.floor(nowSeconds)) > milestone.deadline;
  switch (milestone.status) {
    case "Pending":
      return pastDeadline ? ["submit", "release", "refund"] : ["submit", "release"];
    case "Submitted":
      return pastDeadline ? ["release", "claim"] : ["release"];
    default:
      return [];
  }
}

export function decodeInfo(value: xdr.ScVal): EscrowInfo {
  const native = scValToNative(value) as { client: string; freelancer: string; token: string };
  return { client: native.client, freelancer: native.freelancer, token: native.token };
}

const CLIENT_ACTIONS: EscrowAction[] = ["release", "refund"];
const FREELANCER_ACTIONS: EscrowAction[] = ["submit", "claim"];

/** Restrict actions to those the connected account may call. Unknown role: no restriction. */
export function actionsForAccount(
  actions: EscrowAction[],
  account: string | null,
  info: EscrowInfo | null,
): EscrowAction[] {
  if (!account || !info) return actions;
  if (account === info.client) return actions.filter((a) => CLIENT_ACTIONS.includes(a));
  if (account === info.freelancer) return actions.filter((a) => FREELANCER_ACTIONS.includes(a));
  return [];
}
