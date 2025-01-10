// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
 import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
 
contract Testmint is ERC1155, Ownable {

   string public _baseURI;
   mapping(uint256=>string) public _URIs;
 
   constructor() ERC1155("") Ownable() {
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

   function mint(address account, uint256 id, bytes memory data)
        public
    {
        _mint(account, id, 1, data);
    }
   
}