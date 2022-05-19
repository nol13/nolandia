// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

pragma experimental ABIEncoderV2;

// We import this library to be able to use console.log
import "hardhat/console.sol";


contract Nolandia {
    string public name = "Nolandia";
    string public symbol = "NOLAND";

    //uint256 internal ethFactor = 1000000000000000000;
    uint256 internal ethFactor = 1;

    struct px {
        uint256 color;
        bool owned;
        address owner;
    }

    struct pxToBuy {
        uint256 color;
        uint128 x;
        uint128 y;
    }

    struct pxToTransfer {
        uint128 x;
        uint128 y;
    }

    event PurchasedPixel(
        address indexed owner,
        uint128 x,
        uint128 y,
        uint256 color
    );

    event PixelColorSet(
        address indexed owner,
        uint128 x,
        uint128 y,
        uint256 color
    );

    event PixelTransfered(
        address indexed from,
        address indexed to,
        uint128 x,
        uint128 y
    );

    px[1000][1000] public pixels;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function allPxAvailable (pxToBuy[] calldata requestedPixels) internal view returns (bool) {
        for (uint16 i = 0; i < requestedPixels.length; i++) {
            pxToBuy memory thisPx = requestedPixels[i];
            px memory storedPx = pixels[thisPx.x][thisPx.y];
            if (storedPx.owned == true) return false;
        }
        return true;
    }

    function allPlotPxAvailable (uint16 x1, uint16 y1, uint16 x2, uint16 y2) internal view returns (bool) {
        for (uint16 i = x1; i < x2; i++) {
             for (uint16 j = y1; j < y2; j++) {
                 px memory storedPx = pixels[i][j];
                 if (storedPx.owned == true) return false;
             }
        }
        return true;
    }

    function setPixels (pxToBuy[] calldata requestedPixels) internal {
        for (uint128 i = 0; i < requestedPixels.length; i++) {
            pxToBuy memory thisPx = requestedPixels[i];
            pixels[thisPx.x][thisPx.y] = px({color: thisPx.color, owner: msg.sender, owned: true});
            emit PurchasedPixel(msg.sender, thisPx.x, thisPx.y, thisPx.color);
        }
    }

    function setPlotPixels (uint16 x1, uint16 y1, uint16 x2, uint16 y2) internal {
        for (uint16 x = x1; x < x2; x++) {
             for (uint16 y = y1; y < y2; y++) {
                pixels[x][y] = px({color: 0, owner: msg.sender, owned: true});
                emit PurchasedPixel(msg.sender, x, y, 0);
             }
        }
    }

    function buyPixels(pxToBuy[] calldata requestedPixels) external payable {
        require(msg.value >= requestedPixels.length * ethFactor, 'wrong amount');
        require(allPxAvailable(requestedPixels) != false, 'some pixels already owned');
        setPixels(requestedPixels);
        payable(owner).transfer(msg.value);
    }

    function setSinglePixelColor(uint128 x, uint128 y, uint256 color) public {
        require(pixels[x][y].owner == msg.sender, 'dont own this pixel');
        pixels[x][y].color = color;
    }

    function setPixelsColor(pxToBuy[] calldata updatingPixels) external {
        for (uint16 i = 0; i < updatingPixels.length; i++) {
            setSinglePixelColor(updatingPixels[i].x, updatingPixels[i].y, updatingPixels[i].color);
        }
    }

    function transferPixels(pxToTransfer[] calldata transferingPixels, address to) external {
        for (uint16 i = 0; i < transferingPixels.length; i++) {
            pxToTransfer memory thisPx = transferingPixels[i];
            require(pixels[thisPx.x][thisPx.y].owner == msg.sender, "can't transfer what you don't own");
            pixels[thisPx.x][thisPx.y].owner = to;
            emit PixelTransfered(msg.sender, to, thisPx.x, thisPx.y);
        }
    }

     function buyPlot(uint16 x1, uint16 x2, uint16 y1, uint16 y2) external payable {
        require(x1 >= 0 && y1 >= 0, "first coord 0 or bigger");
        require(x2 <= 1000 && y2 <= 1000, "second coord 1000 or smaller");
        require(x1 < x2 && y1 < y2, "2nd coord smaller than first coord");
        uint totalAmt = (x2 - x1) * (y2 - y1);
        require(totalAmt * ethFactor == msg.value, "wrong amount");
        require(allPlotPxAvailable(x1, y1, x2, y2) != false, 'some of these pixels are already owned');
        setPlotPixels(x1, y1, x2, y2);
        payable(owner).transfer(msg.value);
    }
 
    // not needed gets autogend
    /* function getPixels (uint x, uint y) external view returns (px memory ret) {
        return pixels[x][y];
    } */


}
