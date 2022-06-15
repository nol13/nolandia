// contracts/MetaNol2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract Nolandia is ERC721/* , ERC721Enumerable, ERC721Royalty, Ownable */ {

    //uint256 internal ethFactor = 1000000000000000000;
    uint256 internal ethFactor = 1;
    uint8 pxInParcel = 64;

     struct plot {
        uint8 x1;
        uint8 y1;
        uint8 x2;
        uint8 y2;
        uint16 plotId;
        address plotOwner;
    }

     uint16[128][128] public parcels;
     plot[] public plots;
    


    constructor() ERC721("Nolandia", "NOLAND") {}

    function allParcelsAvailable (uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal view returns (bool) {
        for (uint8 i = x1; i < x2; i++) {
             for (uint8 j = y1; j < y2; j++) {
                 uint16 ijParcel = parcels[i][j];
                 if (ijParcel > 0) return false;
             }
        }
        return true;
    }

    function setParcelsOwned (uint8 x1, uint8 y1, uint8 x2, uint8 y2, uint16 plotId) internal {
        for (uint8 x = x1; x < x2; x++) {
             for (uint8 y = y1; y < y2; y++) {
               parcels[x][y] = plotId;
             }
        }
    }

    function buyPlot(uint8 x1, uint8 y1, uint8 x2, uint8 y2) external payable
        returns (uint32)
    {
        require(x1 >= 0 && y1 >= 0, "first coord 0 or bigger");
        require(x2 <= 127 && y2 <= 127, "second coord 1000 or smaller");
        require(x1 < x2 && y1 < y2, "2nd coord smaller than first coord");
        uint totalAmt = (x2 - x1) * (y2 - y1);
        require(totalAmt * ethFactor * pxInParcel == msg.value, "wrong amount");

        uint16 plotId = 1;


        require(allParcelsAvailable(x1, y1, x2, y2) == true, 'a selected parcel is already owned');
        setParcelsOwned(x1, y1, x2, y2, plotId);
        _mint(msg.sender, plotId);
        // _setTokenURI(newItemId, tokenURI);
        //payable(owner1).transfer(msg.value/2);

        return plotId;
    }
}