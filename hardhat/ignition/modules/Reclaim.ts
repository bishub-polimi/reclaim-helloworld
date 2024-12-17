import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Reclaim", (m) => {
  const reclaim = m.contract("Reclaim", []);

  return { reclaim };
});