pragma solidity >=0.4.0 <0.6.0;


contract Migrations {
    address public owner;
    uint public lastMigrationCompleted;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        lastMigrationCompleted = completed;
    }

    function setCompleted(uint newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastMigrationCompleted);
    }
}