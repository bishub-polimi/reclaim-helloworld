import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import Claims from "./Claims";


export default buildModule("AttestorV2", (m) => {
  const { claims} = m.useModule(Claims);
  const attestor = m.contract("Attestor", [process.env.RECLAIM_ADDRESS!], {libraries: {Claims: claims}});

  m.call(attestor,"setBaseURI",[
    "ipfs://bafybeic7co3jyfqum2go2ef4ba3ola5oolabb65dypjpchh6dx3wirqtyi"
  ])


  return { attestor };
});