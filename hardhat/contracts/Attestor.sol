// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
 
import "./Reclaim.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
 
contract Attestor is ERC1155, Ownable {

   address reclaimAddress;
   string public _baseURI;
   mapping(uint256=>string) public _URIs;
 
   constructor(address _reclaimAddress) ERC1155("") Ownable() {
      reclaimAddress = _reclaimAddress;
   }
 
   function verifyProof(Reclaim.Proof memory proof) public view {
       Reclaim(reclaimAddress).verifyProof(proof);
       // Your business logic upon successful verification
       // Example: Verify that proof.context matches your expectations
   }

   function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI, _URIs[tokenId]));
   }

   function setTokenURI(uint256 tokenId, string memory newuri) public onlyOwner {
        _URIs[tokenId] = newuri;
   }

   function setBaseURI(string memory newuri) public onlyOwner {
        _baseURI = newuri;
   }

   function mint(address account, uint256 id, bytes memory data, Reclaim.Proof memory proof)
        public
    {
        Reclaim(reclaimAddress).verifyProof(proof);
        _mint(account, id, 1, data);
    }
   
}