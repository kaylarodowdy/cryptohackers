pragma solidity ^0.4.2;

contract CryptoHackers {
    
    //Model a hacker
    struct Hacker {
        string name;
        uint lvl;
        uint exp;
    }

    string public hello = "HelloHacker";

    constructor () public {
        
    }
}