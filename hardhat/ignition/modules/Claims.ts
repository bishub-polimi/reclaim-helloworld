import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Claims", (m) => {
  const claims = m.contract("Claims", []);

  return { claims };
});