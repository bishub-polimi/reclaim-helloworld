import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import Reclaim from "./Reclaim";


export default buildModule("Attestor", (m) => {
  const { reclaim } = m.useModule(Reclaim);
  const attestor = m.contract("Attestor", [reclaim]);

  return { attestor };
});