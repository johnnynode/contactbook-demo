import "../css/index.css";
import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/ContactBookDAPP.json";

const App = {
  web3: null,
  account: null, 
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.selectAll();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  selectAll: async function(){
    const { getlength } = this.meta.methods;
    var count = await getlength().call();
    if(count){
      const { selectAll } = this.meta.methods;
      var html='';
      for(var x=0;x<count;x++){
        var result = await selectAll(x).call();
        var stats='';
        if(result[3]==1){
          stats='男';
        }else{
          stats='女';
        }
        html+=' <tr>'+
          ' <td><input type="checkbox" style="width: 0px;" id="checkbox"  name="checkbox" data-id="'+result[4]+'"></td>'+
          ' <td id="">'+result[1]+'</td>'+
          ' <td>'+result[0]+'</td>'+
          ' <td>'+result[2]+'</td>'+
          ' <td>'+stats+'</td>'+
          '</tr>';
      }
      const tbodyhtml = document.getElementById('tbody')
      tbodyhtml.innerHTML='';
      tbodyhtml.innerHTML=html;
    }
  },

  save: async function(){
    const { web3 } = this;
    //手机号码
    var codes=document.getElementById('codes').value
    //名称
    var name=document.getElementById('name').value
    //邮件
    var count=document.getElementById('count').value
    //性别
    var status=document.getElementById('switch').value
    if(!code || !name || !count){
      alert("Parameter cannot be null!");
      return
    }
    const { saveinfo } = this.meta.methods;
    await saveinfo(name,codes,count,status).send({from:this.account, gas: 3141592},function(){
    location.reload();
    });
  },

  selectOne: async function() {
    const { web3 } = this;

    var code=document.getElementById('code').value
    if(!code){
      this.start();
    }else{
      const tbodyhtml = document.getElementById('tbody')
      tbodyhtml.innerHTML='';
      const { getlength } = this.meta.methods;
      var count = await getlength().call();
      if(count){
        const { selectOne } = this.meta.methods;
        var html='';
        for(var x=0;x<count;x++){
          var bool = await selectOne(x,code).call();
          if(bool==true){
            const { selectAll } = this.meta.methods;
            var result = await selectAll(x).call();
            var stats='';
            if(result[3]==1){
              stats='男';
            }else{
              stats='女';
            }
            var html=' <tr>'+
              ' <td><input type="checkbox" style="width: 0px;" id="checkbox"  name="checkbox" data-id="'+result[4]+'"></td>'+
              ' <td>'+result[1]+'</td>'+
              ' <td>'+result[0]+'</td>'+
              ' <td>'+result[2]+'</td>'+
              ' <td>'+stats+'</td>'+
              '</tr>';
            tbodyhtml.innerHTML=html;
            return false;
          }
        }
      }else{
        this.start();
      }
    }
  },

  update: async function() {
    const { web3 } = this;
    var dataid='';
    $('tbody').find('input').each(function(){
      if($(this).prop('checked')==true){
        dataid=$(this).attr("data-id");
        return false;
      }
    })
    if(dataid==''){
      alert("No choice!");
      return false;
    }
    const { update } = this.meta.methods;
    update(dataid).send({ from: this.account});
    this.start();
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  $("#codes").blur(function(){
    var value =document.getElementById('codes').value;
    if((/^1[3|4|5|8][0-9]\d{8}$/.test(value))){ 
        return true;   
    }else{
      alert("请输入合法的手机号码");   
      return; 
    }    
  });

  $("#count").blur(function(){
    var value =document.getElementById('count').value;
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
    if (!reg.test(value)) {
      alert("请输入合法的邮箱地址");   
      return; 
    } else {
      return true;
    }  
  });

  App.start();
});
