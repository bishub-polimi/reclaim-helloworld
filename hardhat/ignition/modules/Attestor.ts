import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import Reclaim from "./Reclaim";
import Claims from "./Claims";


export default buildModule("Attestor", (m) => {
  const { claims} = m.useModule(Claims);
  const { reclaim } = m.useModule(Reclaim);
  const attestor = m.contract("Attestor", [reclaim], {libraries: {Claims: claims}});

  return { attestor };
});