// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserID {
    bytes32 private storedhash;
    string public eventType = "User ID Creation";

    constructor(string memory userID) {
        storedhash = sha256(abi.encodePacked(userID));
    }

    function verify(string calldata number) external view returns (bool) {
        return sha256(abi.encodePacked(number)) == storedhash;
    }
}

contract UserIDFactory {
    address[] public deployedUserIDs;

    event UserIDCreated(address indexed userContract, address indexed owner);

    // Deploy a new UserID contract
    function createUserID(string calldata userID) external {
        UserID newUser = new UserID(userID);
        deployedUserIDs.push(address(newUser));
        emit UserIDCreated(address(newUser), msg.sender);
    }

    // ✅ Verify against ALL deployed contracts
    function verify(string calldata number) external view returns (bool) {
        for (uint i = 0; i < deployedUserIDs.length; i++) {
            if (UserID(deployedUserIDs[i]).verify(number)) {
                return true; // Found a match
            }
        }
        return false; // No match found
    }

    // Helper: return how many contracts
    function getCount() external view returns (uint256) {
        return deployedUserIDs.length;
    }

    // Helper: return all addresses
    function getAllUserIDs() external view returns (address[] memory) {
        return deployedUserIDs;
    }
}