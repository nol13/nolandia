// contracts/MetaNol2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract Nolandia is ERC721, Ownable /* , ERC721Enumerable, ERC721Royalty */ {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //uint256 internal ethFactor = 1000000000000000000;
    uint256 internal ethFactor = 1;
    uint8 pxInParcel = 64;

    struct plot {
        uint8 x1;
        uint8 y1;
        uint8 x2;
        uint8 y2;
        uint256 plotId;
        address plotOwner;
    }

    event PlotPixelsSet(
        uint256 indexed plotId,
        uint256[] pixels
    );

     event PlotPurchased(
        uint256 indexed plotId,
        address plotOwner,
        uint8 x1,
        uint8 y1,
        uint8 x2,
        uint8 y2
    );


     uint256[128][128] public parcels;
     mapping(uint256 => plot) plots;

    
    constructor() ERC721("Nolandia", "NOLAND") {}

    function allParcelsAvailable (uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal view returns (bool) {
        for (uint8 i = x1; i < x2; i++) {
             for (uint8 j = y1; j < y2; j++) {
                 uint256 ijParcel = parcels[i][j];
                 if (ijParcel > 0) return false;
             }
        }
        return true;
    }

    function setParcelsOwned (uint8 x1, uint8 y1, uint8 x2, uint8 y2, uint256 plotId) internal {
        for (uint8 x = x1; x < x2; x++) {
             for (uint8 y = y1; y < y2; y++) {
               parcels[x][y] = plotId;
             }
        }
    }

    function buyPlot(uint8 x1, uint8 y1, uint8 x2, uint8 y2) external payable
        returns (uint256)
    {
        require(x1 >= 0 && y1 >= 0, "first coord 0 or bigger");
        require(x2 <= 127 && y2 <= 127, "second coord 1000 or smaller");
        require(x1 < x2 && y1 < y2, "2nd coord smaller than first coord");
        uint totalAmt = (x2 - x1) * (y2 - y1);
        require(totalAmt * ethFactor * pxInParcel == msg.value, "wrong amount");
        uint256 plotId = _tokenIds.current();
        _tokenIds.increment();
        require(allParcelsAvailable(x1, y1, x2, y2) == true, 'a selected parcel is already owned');
        setParcelsOwned(x1, y1, x2, y2, plotId);
        _safeMint(msg.sender, plotId);
        plots[plotId] = plot({x1: x1, y1: y1, x2: x2, y2: y2, plotId: plotId, plotOwner: msg.sender});

        //payable(owner1).transfer(msg.value/2); // should prob use PaymentSplitter instead
        //payable(owner2).transfer(msg.value/2);
        //payable(owner3).transfer(0);
        emit PlotPurchased(plotId, msg.sender, x1, y1, x2, y2);
        return plotId;
    }

     function setPixels (uint256[] calldata pixels, uint256 plotId) internal {
        require(ownerOf(plotId) == msg.sender, "u dont own this");
        plot memory myPlot = plots[plotId];
        uint32 totalPxInPlot = (myPlot.x2 - myPlot.x1) * (myPlot.y2 - myPlot.y1);
        require(totalPxInPlot * pxInParcel == pixels.length, "wrong amount of px");
        emit PlotPixelsSet(plotId, pixels);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        //(, int256 price, , , ) = i_priceFeed.latestRoundData();
        //string memory imageURI = s_lowImageURI;
        //if (price >= s_tokenIdToHighValues[tokenId]) {
        //    imageURI = s_highImageURI;
        //}
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(), // You can add whatever name here
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                //imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}