// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
 
import "./Reclaim.sol";
import "./Claims.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
 
contract Attestor is ERC1155, Ownable {

   string public name = "Web3Hub Proofs"; 
   address reclaimAddress;
   string public _baseURI;
 
   constructor(address _reclaimAddress) ERC1155("") Ownable() {
      reclaimAddress = _reclaimAddress;
   }
 
   function verifyProof(Reclaim.Proof memory proof) public view {
       Reclaim(reclaimAddress).verifyProof(proof);
       // Your business logic upon successful verification
       // Example: Verify that proof.context matches your expectations
   }

   function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI,'/', Strings.toString(tokenId),'.json'));
   }

   function setBaseURI(string memory newuri) public onlyOwner {
        _baseURI = newuri;
   }

   function mint(address account, bytes memory data, Reclaim.Proof memory proof)
        public
    {
        Reclaim(reclaimAddress).verifyProof(proof);
        
        //check license points
        string memory pointsString = Claims.extractFieldFromContext(proof.claimInfo.context,'"saldoPunti":"');

        if(bytes(pointsString).length > 0){
          uint256 points = stringToUint(pointsString);
          if(points > 29){
               _mint(account, 0, 1, data);
          } else {
            revert("Punti della patente insufficienti: richiesti almeno 30pt");
          }
        } else {
          //check donations
          string memory donationsString = Claims.extractFieldFromContext(proof.claimInfo.context,'"totalDonations":"');

          if(bytes(donationsString).length > 0){
            uint256 donations = stringToUint(donationsString);
            if(donations > 0){
                _mint(account, 1, 1, data);
            } else {
                revert("Donazione assente: richiesta almeno 1 donazione");
            }
          } else {
            //check survey
            string memory footprintString = Claims.extractFieldFromContext(proof.claimInfo.context,'"annualFootprint":"');

            if(bytes(footprintString).length > 0){
                uint256 footprint = stringToUint(footprintString);
                if(footprint < 20){
                    _mint(account, 2, 1, data);
                } else {
                    revert("Punteggio insufficiente: richiesto almeno 20");
                }
            }
          }
        }

    }

    /* function stringToUint(string memory str) internal pure returns (uint) {
        bytes memory b = bytes(str);
        uint result = 0;
        for (uint i = 0; i < b.length; i++) {
            // Make sure the character is a digit
            require(uint8(b[i]) >= 48 && uint8(b[i]) <= 57, "Invalid numerical string");
            
            // Convert character to integer and add to result
            // ASCII of '0' is 48, so we subtract 48 to get the actual number
            result = result * 10 + (uint8(b[i]) - 48);
        }
        return result;
    } */

    function stringToUint(string memory str) internal pure returns (uint) {
        bytes memory b = bytes(str);
        uint result = 0;
        bool decimalFound = false;
        
        for (uint i = 0; i < b.length; i++) {
            // Se troviamo un punto decimale, interrompiamo il ciclo
            if (b[i] == 0x2E) {  // 0x2E è il punto decimale "."
                break;
            }
            
            // Verifichiamo che il carattere sia un numero
            require(uint8(b[i]) >= 48 && uint8(b[i]) <= 57, "Invalid numerical string");
            
            // Convertiamo il carattere in numero e lo aggiungiamo al risultato
            result = result * 10 + (uint8(b[i]) - 48);
        }
        
        return result;
    }

     function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        // Allow minting (transfer from zero address)
        if (from != address(0)) {
            revert("Transfer not allowed");
        }
        return;
    }
   
}