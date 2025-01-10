import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default buildModule("Testmint", (m) => {
  const testmint = m.contract("Testmint");
  return { testmint };
});