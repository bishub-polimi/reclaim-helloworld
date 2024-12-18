import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Reclaim", (m) => {
  const reclaim = m.contract("Reclaim", []);

  m.call(reclaim,"addNewEpoch",[
    [["0x244897572368Eadf65bfBc5aec98D8e5443a9072","https://reclaim-node.questbook.app"]],
    1
  ])

  return { reclaim };
});