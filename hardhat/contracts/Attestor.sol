// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
 
import "./Reclaim.sol";
 
contract Attestor {
   address reclaimAddress;
 
   constructor(address _reclaimAddress) {
      reclaimAddress = _reclaimAddress;
   }
 
   function verifyProof(Reclaim.Proof memory proof) public view {
       Reclaim(reclaimAddress).verifyProof(proof);
       // Your business logic upon successful verification
       // Example: Verify that proof.context matches your expectations
   }
}