//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    mapping(uint256 => ListedToken) private idToListedToken;
    address payable owner;
    uint256 listPrice = 0.01 ether;

    event TokenListedSuccess(
        uint256 indexed tokenId, address owner, address seller, uint256 price, bool currentlyListed
    );

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");

        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();

        return idToListedToken[currentTokenId];
    }

    function getListedTokenForTokenId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        require(msg.value == listPrice, "Hopefully sending the correct price");

        idToListedToken[tokenId] = ListedToken(tokenId, payable(address(this)), payable(msg.sender), price, true);

        approve(address(this), tokenId);

        emit TokenListedSuccess(tokenId, address(this), msg.sender, price, true);
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 nftCount = _tokenIds.current();

        ListedToken[] memory tokens = new ListedToken[](nftCount);
        for (uint256 i = 0; i < nftCount; i++) {
            ListedToken memory currentItem = idToListedToken[i + 1];

            tokens[i] = currentItem;
        }

        return tokens;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalTokens = _tokenIds.current();

        uint256 nftCount = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            if (idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                nftCount += 1;
            }
        }

        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint256 currentIdx = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            if (idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                ListedToken memory currentItem = idToListedToken[i + 1];

                tokens[currentIdx] = currentItem;

                currentIdx += 1;
            }
        }

        return tokens;
    }

    function executeSale(uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;

        address seller = idToListedToken[tokenId].seller;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        // Update the details of the token
        idToListedToken[tokenId].seller = payable(msg.sender);

        _itemsSold.increment();

        // Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);

        // Approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);

        // Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    // We might add a resell token function in the future
    // In that case, tokens won't be listed by default but users can send a request to actually list a token
    // Currently NFTs are listed by default
}
