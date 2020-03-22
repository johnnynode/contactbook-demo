pragma solidity >=0.4.21 <0.6.0;

contract test {

    uint[] len;

    function add() public {
        len.push(1);
    }

    function get() public view returns(uint lens){
        return len.length;
    }
}
