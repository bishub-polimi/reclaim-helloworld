import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import Claims from "./Claims";


export default buildModule("AttestorV2", (m) => {
  const { claims} = m.useModule(Claims);
  const attestor = m.contract("Attestor", [process.env.RECLAIM_ADDRESS!], {libraries: {Claims: claims}});

  m.call(attestor,"setBaseURI",[
    "ipfs://bafybeibiieuysql3mqejxxjytuct2lfytqhbsf2h7n54m27wtib2vnrxue"
  ])


  return { attestor };
});