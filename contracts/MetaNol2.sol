// contracts/MetaNol2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

contract GameItem is ERC721/* , ERC721Enumerable, ERC721Royalty, Ownable */ {

    mapping(uint32 => bool) _plotIsOwned;
    


    constructor() ERC721("Nolandia", "NOLAND") {}

    function buyPlot(address player, uint32[] calldata plotIds) external payable
        returns (uint32)
    {


         require( _plotIsOwned[plotIds[0]] != true, 'already owned');
        _plotIsOwned[plotIds[0]] = true;
        _mint(player, plotIds[0]);
        // _setTokenURI(newItemId, tokenURI);

        return plotIds[0];
    }
}