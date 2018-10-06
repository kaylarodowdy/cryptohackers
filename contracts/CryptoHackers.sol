pragma solidity ^0.4.2;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract CryptoHackers is ERC721Token, Ownable  {

    // string public constant name = "CryptoHackerToken";
    // string public constant symbol = "HACK";
    
    //Model a hacker
    struct Hacker {
        string name;
        uint lvl;
        uint exp;
    }

    Hacker[] public hackers;

    string public hello = "HelloHacker";

    constructor ( string _name, string _symbol) public ERC721Token(_name, _symbol){
        
    }

    function mintUniqueHackerTokenTo (string _name) public {
        Hacker memory _hacker = Hacker({name: _name, lvl: 0, exp: 0});
        uint _hackerId = hackers.push(_hacker);

        _mint(msg.sender, _hackerId);
    }
}