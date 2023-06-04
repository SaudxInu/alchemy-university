// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "Can't buy coffee with 0 ETH.");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit newMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can call this function.");

        (bool success, ) = owner.call{value: address(this).balance}("");

        require(success, "Failed to withdraw tips.");
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
