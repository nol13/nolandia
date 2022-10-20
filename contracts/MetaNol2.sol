// contracts/MetaNol2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract Nolandia is
    ERC721,
    Ownable,
    PaymentSplitter /* , ERC721Enumerable, ERC721Royalty */
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //uint256 internal ethFactor = 1000000000000000000;
    uint256 internal ethFactor = 1;
    uint8 pxInParcel = 64;
    uint8 valsPerPixel = 4;

    struct plot {
        uint8 x1;
        uint8 y1;
        uint8 x2;
        uint8 y2;
        uint256 plotId;
        address plotOwner;
    }

    event PlotPixelsSet(uint256 indexed plotId, uint8[] imageData);

    event PlotPurchased(
        uint256 indexed plotId,
        address plotOwner,
        uint8 x1,
        uint8 y1,
        uint8 x2,
        uint8 y2,
        uint256 sparkles,
        string mineral,
        string landType,
        string squirrelColor
    );

    uint256[128][128] public parcels;
    mapping(uint256 => plot) public plots;
    string internal _baseUriVal;

    uint256 randCounter = 0;

    string[] landTypes = [
        "rainforrest",
        "rainforrest",
        "desert",
        "desert",
        "desert",
        "desert",
        "taiga",
        "taiga",
        "taiga",
        "taiga",
        "warm wetland",
        "cold wetland",
        "snow",
        "mountain",
        "savanah",
        "snow",
        "mountain",
        "savanah",
        "lunar regolith",
        "prarie",
        "prarie"
    ];

    string[] localSquirrelColor = [
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "auburn",
        "brown",
        "auburn",
        "black",
        "black",
        "white",
        "blonde",
        "blonde",
        "blonde",
        "red",
        "red"
    ];

    string[] minerals = [
        "gold",
        "silver",
        "gold",
        "silver",
        "silver",
        "coper",
        "coper",
        "coper",
        "coper",
        "iron",
        "iron",
        "iron",
        "iron",
        "iron",
        "platinum",
        "unobtainium",
        "sand",
        "sand",
        "sand",
        "ruby",
        "ruby",
        "boron",
        "boron",
        "salt",
        "salt",
        "salt",
        "salt",
        "tiberium"
    ];

    constructor(
        address[] memory _payees,
        uint256[] memory _shares,
        string memory initialBaseUri,
        uint8[][4] memory prePlots
    ) payable ERC721("Nolandia", "NOLAND") PaymentSplitter(_payees, _shares) {
        _baseUriVal = initialBaseUri;
        preMintPlots(prePlots);
    }

    function randomNum() private returns (uint256) {
        randCounter++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        randCounter
                    )
                )
            );
    }

    function randomItem(string[] memory arr) private returns (string memory) {
        return arr[randomNum() % arr.length];
    }

    function allParcelsAvailable(
        uint8 x1,
        uint8 y1,
        uint8 x2,
        uint8 y2
    ) internal view returns (bool) {
        for (uint8 i = x1; i < x2; i++) {
            for (uint8 j = y1; j < y2; j++) {
                uint256 ijParcel = parcels[i][j];
                if (ijParcel > 0) return false;
            }
        }
        return true;
    }

    function setParcelsOwned(
        uint8 x1,
        uint8 y1,
        uint8 x2,
        uint8 y2,
        uint256 plotId
    ) internal {
        for (uint8 x = x1; x < x2; x++) {
            for (uint8 y = y1; y < y2; y++) {
                parcels[x][y] = plotId;
            }
        }
    }

    function buyPlot(
        uint8 x1,
        uint8 y1,
        uint8 x2,
        uint8 y2
    ) external payable returns (uint256) {
        require(x1 >= 0 && y1 >= 0, "first coord 0 or bigger");
        require(x2 <= 128 && y2 <= 128, "second coord 128 or smaller");
        require(x1 < x2 && y1 < y2, "2nd coord smaller than first coord");
        uint256 totalAmt = (x2 - x1) * (y2 - y1);
        require(totalAmt * ethFactor * pxInParcel == msg.value, "wrong amount");
        _tokenIds.increment();
        uint256 plotId = _tokenIds.current();
        require(
            allParcelsAvailable(x1, y1, x2, y2) == true,
            "a selected parcel is already owned"
        );
        setParcelsOwned(x1, y1, x2, y2, plotId);
        _safeMint(msg.sender, plotId);
        plots[plotId] = plot({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            plotId: plotId,
            plotOwner: msg.sender
        });

        uint256 sparkles = totalAmt * (randomNum() % 4);
        string memory mineral = randomItem(minerals);
        string memory landType = randomItem(landTypes);
        string memory squirrelColor = randomItem(localSquirrelColor);

        emit PlotPurchased(plotId, msg.sender, x1, y1, x2, y2, sparkles, mineral, landType, squirrelColor);
        return plotId;
    }

    function preMintPlots(uint8[][4] memory prePlots) internal {
        for (uint8 i = 0; i < prePlots.length; i++) {
            uint8 x1 = prePlots[i][0];
            uint8 y1 = prePlots[i][1];
            uint8 x2 = prePlots[i][2];
            uint8 y2 = prePlots[i][3];

            require(x1 >= 0 && y1 >= 0, "first coord 0 or bigger");
            require(x2 <= 128 && y2 <= 128, "second coord 128 or smaller");
            require(x1 < x2 && y1 < y2, "2nd coord smaller than first coord");
            require(
                allParcelsAvailable(x1, y1, x2, y2) == true,
                "a selected parcel is already owned"
            );
            _tokenIds.increment();
            uint256 plotId = _tokenIds.current();
            setParcelsOwned(x1, y1, x2, y2, plotId);
            _safeMint(msg.sender, plotId);
            plots[plotId] = plot({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                plotId: plotId,
                plotOwner: msg.sender
            });

        uint256 totalAmt = (x2 - x1) * (y2 - y1);
        uint256 sparkles = totalAmt * (randomNum() % 4);
        string memory mineral = randomItem(minerals);
        string memory landType = randomItem(landTypes);
        string memory squirrelColor = randomItem(localSquirrelColor);

        emit PlotPurchased(plotId, msg.sender, x1, y1, x2, y2, sparkles, mineral, landType, squirrelColor);
        // emit PlotPurchased(plotId, msg.sender, x1, y1, x2, y2);
        }

        // return plotId;
    }

    /* function setPixels (uint8[] calldata pixels, uint256 plotId) external {
        require(ownerOf(plotId) == msg.sender, "u dont own this");
        plot memory myPlot = plots[plotId];
        uint32 xdiff = myPlot.x2 - myPlot.x1;
        uint32 ydiff = myPlot.y2 - myPlot.y1;
        uint32 totalPxInPlot = (xdiff * ydiff * pxInParcel * valsPerPixel);
        require(totalPxInPlot == pixels.length, "wrong amount of px");
        emit PlotPixelsSet(plotId, pixels);
    } */

    function _baseURI() internal view override returns (string memory) {
        //return "data:application/json;base64,";
        return _baseUriVal;
    }

    function setBaseURI(string calldata newBaseUri) public onlyOwner {
        _baseUriVal = newBaseUri;
    }

    /* function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory imageURI = "myImageUrixxxxxx";
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                ' - Plot ',
                                Strings.toString(tokenId), // You can add whatever name here
                                '", "description":"A Plot of Nolandian Metaland", ',
                                '"attributes": [',
                                '{"trait_type": "coord1", "value": [10, 10]},',
                                '{"trait_type": "coord2", "value": [11, 11]},',
                                '{"trait_type": "totalPixels", "value": 64},',
                                '{"trait_type": "terrain", "value": "mountain"}',
                                '], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    } */
}
