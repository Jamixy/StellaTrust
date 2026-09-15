export const demoProjects = [
  {
    id: "proj_1",
    title: "Brand refresh for Northstar Labs",
    description: "Design system updates, homepage optimization, and launch assets for a B2B SaaS product.",
    client: "GDRS5FGWZ7EJ2B6Q4QNMRT5Z5U6W5F6C7VZ2Z5RMQ4J2R7F2Z7M6FYV",
    freelancer: "GAXS2Q7U7SI4BFH7A3YF5V3HX2L7NQZP5PFM4GPHKTK2N7EG2C5XYB",
    budget: "3200",
    asset: "XLM",
    status: "ACTIVE",
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    milestones: [
      { id: "ms_1", title: "Discovery and strategy", description: "Research and positioning workshop", amount: "1200", dueDate: "2026-09-08", status: "APPROVED" },
      { id: "ms_2", title: "Visual design system", description: "Components and landing page mockups", amount: "1200", dueDate: "2026-09-20", status: "FUNDED" },
      { id: "ms_3", title: "Final delivery", description: "Launch assets and QA pass", amount: "800", dueDate: "2026-10-05", status: "PENDING" },
    ],
  },
  {
    id: "proj_2",
    title: "Stellar wallet onboarding flow",
    description: "UX audit and onboarding flow redesign for a wallet onboarding product.",
    client: "GB5NQH7P6V2C6K3FQZV7W6GZV7J5N7G4R6J3JXH5A4GJP7N3S3D4A",
    freelancer: "GDXLQ2M7YJ7G4B7Y5W4C2Q7F6W4H9T8M3F7Q2W5X4D5V3L7G8K9Q",
    budget: "4600",
    asset: "USD",
    status: "ACTIVE",
    startDate: "2026-08-15",
    endDate: "2026-09-29",
    milestones: [
      { id: "ms_4", title: "Research and audit", description: "Current onboarding critique and recommendations", amount: "1800", dueDate: "2026-08-27", status: "RELEASED" },
      { id: "ms_5", title: "Prototype flow", description: "Interactive prototype and authenticated UX review", amount: "1400", dueDate: "2026-09-12", status: "SUBMITTED" },
      { id: "ms_6", title: "Implementation support", description: "Developer handoff and validation review", amount: "1400", dueDate: "2026-09-29", status: "FUNDED" },
    ],
  },
];

export const demoTransactions = [
  {
    id: "tx_1",
    hash: "2d4a1fc1f33f8f4d1d4ce1e57c0a851d7d74b75cd8d722b4a9327a93a8c1b09",
    amount: "1200",
    asset: "XLM",
    sender: "GDRS5FGWZ7EJ2B6Q4QNMRT5Z5U6W5F6C7VZ2Z5RMQ4J2R7F2Z7M6FYV",
    recipient: "GAXS2Q7U7SI4BFH7A3YF5V3HX2L7NQZP5PFM4GPHKTK2N7EG2C5XYB",
    status: "SUCCESS",
    timestamp: "2026-09-06T10:15:00Z",
    network: "testnet",
    explorerUrl: "https://testnet.stellar.org/explorer/testnet/tx/2d4a1fc1f33f8f4d1d4ce1e57c0a851d7d74b75cd8d722b4a9327a93a8c1b09",
  },
  {
    id: "tx_2",
    hash: "8e0f4b2f7b0d59a9cde205d0ddd87cc9758c8fa4e0d2dcdc38e2c90ab0961b6f",
    amount: "1400",
    asset: "USD",
    sender: "GB5NQH7P6V2C6K3FQZV7W6GZV7J5N7G4R6J3JXH5A4GJP7N3S3D4A",
    recipient: "GDXLQ2M7YJ7G4B7Y5W4C2Q7F6W4H9T8M3F7Q2W5X4D5V3L7G8K9Q",
    status: "SUCCESS",
    timestamp: "2026-08-24T08:05:00Z",
    network: "testnet",
    explorerUrl: "https://testnet.stellar.org/explorer/testnet/tx/8e0f4b2f7b0d59a9cde205d0ddd87cc9758c8fa4e0d2dcdc38e2c90ab0961b6f",
  },
];

export const walletBalances = [
  { asset: "XLM", balance: "245.84" },
  { asset: "USDC", balance: "580.00" },
  { asset: "EURC", balance: "120.75" },
];
