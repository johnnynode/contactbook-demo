pragma solidity >=0.4.21 <0.6.0;
 
/**
 * owned是合约的管理者
 */
contract owned {
    address public owner;
 
    /**
     * 初台化构造函数
     */
    constructor() public {
        owner = msg.sender;
    }
 
    /**
     * 判断当前合约调用者是否是合约的所有者
     */
    modifier onlyOwner {
        require( msg.sender == owner,
        "sender is not authorized");
        _;
    }
 
    /**
     * 合约的所有者指派一个新的管理员
     * @param  newOwner address 新的管理员帐户地址
     */
    function transferOwnership(address newOwner) onlyOwner public{
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

contract ContactBookDAPP is owned{

    //属性
    struct Comminfo {
        string name;//姓名
        string telephone;    //手机号码
        string email;  //邮件地址
        uint8  gender;  //性别 1.男 2.女
    }

    //记录所有数据映射
    mapping (uint => Comminfo) commOf;
    
    uint[] lengths;

    constructor() public{}

    //获取长度
    function getlength() public view returns (uint len){
        return lengths.length;
    }

    //保存
    function saveinfo(string memory name ,string memory telephone,string memory email,uint8 gender) public{
        uint les = lengths.length;

        commOf[les].name = name;
        commOf[les].telephone=telephone;
        commOf[les].email=email;
        commOf[les].gender=gender;
        lengths.push(les);
    }
 
    //查询数据
    function selectAll(uint key) public view returns (string memory name ,string memory telephone,
    string memory email,uint8 gender,uint id){
        name=commOf[key].name;
        telephone=commOf[key].telephone;
        email=commOf[key].email;
        gender=commOf[key].gender;  
        id=key;

        return (name,telephone,email,gender,id);
    }

    //两个string比较
    function utilCompareInternal(string memory a, string memory b) 
    internal pure returns (bool succ) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        }
        for (uint i = 0; i < bytes(a).length; i ++) {
            if(bytes(a)[i] != bytes(b)[i]) {
                return false;
            }
        }
        return true;
    }

    //根据手机号码获取数据
    function selectOne(uint key,string memory telephone) public view returns(bool result){
        return utilCompareInternal(commOf[key].telephone,telephone);
    }

}
