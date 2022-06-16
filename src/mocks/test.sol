// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract test {
    uint num;

    function set(uint _num) public {
        num = _num;
    }

    function show() public view returns (uint) {
        return num;
    }
}
