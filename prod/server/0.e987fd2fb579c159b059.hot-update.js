exports.id=0,exports.modules={"./src/server/server.js":function(e,r,s){"use strict";s.r(r);var t=s("./build/contracts/FlightSuretyApp.json"),o=s("./src/server/config.json"),n=s("web3"),c=s.n(n),a=s("express"),u=s.n(a),l=o.localhost,i=new c.a(new c.a.providers.WebsocketProvider(l.url.replace("http","ws")));i.eth.defaultAccount=i.eth.accounts[0];var p=new i.eth.Contract(t.abi,l.appAddress),d=[];i.eth.getAccounts().then((function(e){for(var r=0;r<oraclesCount;r++)p.methods.registerOracle().send({from:e[r],value:i.utils.toWei("1","ether"),gas:3e6}),d.push(oracle)})),p.events.OracleRequest({fromBlock:0},(function(e,r){e&&console.log(e),d.console.log(r)}));var h=u()();h.get("/api",(function(e,r){r.send({message:"An API for use with your Dapp!"})})),r.default=h}};