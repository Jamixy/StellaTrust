import "dotenv/config";
import cors from "cors";
import express from "express";
import { createStellarPaymentService } from "@stellar-trust/stellar";
import { isPositiveAmount, isValidStellarAddress, validateProjectInput, validateMilestoneInput } from "@stellar-trust/validation";
import { demoProjects, demoTransactions, walletBalances } from "./demo-data.js";

const app = express();
const port = Number(process.env.PORT ?? 4001);
const stellarService = createStellarPaymentService(process.env);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", network: stellarService.getNetwork() });
});

app.get("/api/projects", (_req, res) => {
  res.json({ projects: demoProjects, count: demoProjects.length });
});

app.get("/api/projects/:id", (req, res) => {
  const project = demoProjects.find((item: { id: string }) => item.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  return res.json({ project });
});

app.post("/api/projects", (req, res) => {
  const { title, description, freelancer, budget, asset, startDate, endDate } = req.body ?? {};
  const validation = validateProjectInput({ title, description, freelancer, budget, startDate, endDate });

  if (!validation.ok) {
    return res.status(400).json({ errors: validation.errors });
  }

  const project = {
    id: `proj_${Date.now()}`,
    title: String(title),
    description: String(description),
    client: "GDRS5FGWZ7EJ2B6Q4QNMRT5Z5U6W5F6C7VZ2Z5RMQ4J2R7F2Z7M6FYV",
    freelancer: String(freelancer),
    budget: String(budget),
    asset: String(asset ?? "XLM"),
    status: "ACTIVE",
    startDate: String(startDate),
    endDate: String(endDate),
    milestones: [],
  };

  demoProjects.unshift(project);
  return res.status(201).json({ project });
});

app.post("/api/projects/:id/milestones", (req, res) => {
  const project = demoProjects.find((item: { id: string }) => item.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const { title, description, amount, dueDate } = req.body ?? {};
  const validation = validateMilestoneInput({ title, description, amount, dueDate });

  if (!validation.ok) {
    return res.status(400).json({ errors: validation.errors });
  }

  const milestone = {
    id: `ms_${Date.now()}`,
    title: String(title),
    description: String(description),
    amount: String(amount),
    dueDate: String(dueDate),
    status: "PENDING",
  };

  project.milestones.push(milestone);
  return res.status(201).json({ milestone });
});

app.get("/api/wallet", (_req, res) => {
  res.json({
    publicAddress: "GDRS5FGWZ7EJ2B6Q4QNMRT5Z5U6W5F6C7VZ2Z5RMQ4J2R7F2Z7M6FYV",
    network: "testnet",
    balances: walletBalances,
  });
});

app.post("/api/stellar/validate-address", (req, res) => {
  const { address } = req.body ?? {};
  if (typeof address !== "string") {
    return res.status(400).json({ error: "Address is required" });
  }

  return res.json({ valid: isValidStellarAddress(address) });
});

app.post("/api/stellar/quote-payment", async (req, res) => {
  try {
    const { sourcePublicKey, destination, amount, assetCode } = req.body ?? {};

    if (!sourcePublicKey || !destination || !amount) {
      return res.status(400).json({ error: "sourcePublicKey, destination, and amount are required" });
    }

    if (!isPositiveAmount(amount)) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    if (!stellarService.validateDestination(destination)) {
      return res.status(400).json({ error: "Destination address is invalid" });
    }

    const account = await stellarService.checkSourceAccount(sourcePublicKey);
    return res.json({
      source: sourcePublicKey,
      destination,
      amount,
      asset: assetCode ?? "XLM",
      sequence: account.sequence,
      network: stellarService.getNetwork(),
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Unable to validate payment",
    });
  }
});

app.post("/api/stellar/submit-payment", async (req, res) => {
  try {
    const { sourcePublicKey, sourceSecret, destination, amount, assetCode } = req.body ?? {};

    if (!sourcePublicKey || !sourceSecret || !destination || !amount) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    if (!stellarService.validateDestination(destination)) {
      return res.status(400).json({ error: "Destination address is invalid" });
    }

    const account = await stellarService.checkSourceAccount(sourcePublicKey);
    const balances = account.balances.map((balance: { balance: string; asset_type: string; asset_code?: string }) => ({
      balance: balance.balance,
      asset: balance.asset_type === "native" ? "XLM" : balance.asset_code ?? balance.asset_type,
    }));

    const minBalance = Number(balances[0]?.balance ?? "0");
    if (Number(amount) > minBalance) {
      return res.status(400).json({ error: "Source account does not have enough balance" });
    }

    const tx = stellarService.buildPaymentTransaction({
      sourcePublicKey,
      destination,
      amount,
      assetCode: assetCode ?? "XLM",
    });

    const signedTransaction = stellarService.signTransaction(tx, sourceSecret);
    const submission = await stellarService.submitTransaction(signedTransaction);

    return res.json({
      status: submission.status,
      hash: submission.hash,
      network: stellarService.getNetwork(),
      explorerUrl: `${process.env.NEXT_PUBLIC_STELLAR_EXPLORER ?? "https://testnet.stellar.org/explorer/testnet/tx/"}${submission.hash}`,
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Unable to submit payment",
    });
  }
});

app.get("/api/transactions", (_req, res) => {
  res.json({ transactions: demoTransactions, count: demoTransactions.length });
});

app.get("/api/transactions/:id", (req, res) => {
  const transaction = demoTransactions.find((item: { hash: string; id: string }) => item.hash === req.params.id || item.id === req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  return res.json({ transaction });
});

app.listen(port, () => {
  console.log(`StellarTrust API listening on http://localhost:${port}`);
});
