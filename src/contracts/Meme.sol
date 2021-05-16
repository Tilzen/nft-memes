pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract Meme is ERC721Full {
    string[] public memes;
    mapping(string => bool) _memeExists;

    constructor() ERC721Full("Meme", "MEME") public {
    }

    function mint(string memory _meme) public {
        require(!_memeExists[_meme]);

        uint _id = memes.push(_meme);

        _mint(msg.sender, _id);
        _memeExists[_meme] = true;
    }
}