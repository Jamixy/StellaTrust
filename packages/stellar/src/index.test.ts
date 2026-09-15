import { describe, expect, it } from "vitest";
import { StellarPaymentService } from "./index";

describe("StellarPaymentService", () => {
  it("accepts a valid Stellar public key", () => {
    const service = new StellarPaymentService({ network: "testnet", horizonUrl: "https://horizon-testnet.stellar.org" });
    const validAddress = "GB7LN4TZQ7NCARKPCKMOK54YS5LLBGWC3QVTYJVCHBCSPMZU5JJOIOYZ";
    expect(service.validateDestination(validAddress)).toBe(true);
  });

  it("flags invalid addresses", () => {
    const service = new StellarPaymentService({ network: "testnet", horizonUrl: "https://horizon-testnet.stellar.org" });
    expect(service.validateDestination("not-a-stellar-address")).toBe(false);
  });
});
