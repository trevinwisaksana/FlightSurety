exports.id=0,exports.modules={"./src/server/server.js":function(e,t,s){"use strict";s.r(t);var r=s("./build/contracts/FlightSuretyApp.json"),o=s("./src/server/config.json"),n=s("web3"),a=s.n(n),c=s("express"),i=s.n(c),l=o.localhost,u=new a.a(new a.a.providers.WebsocketProvider(l.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var d=new u.eth.Contract(r.abi,l.appAddress),h=[],f=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var t=function(t){d.methods.registerOracle().send({from:e[t],value:u.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(s){d.methods.getMyIndexes().call({from:e[t]}),console.log("Oracle Address: ",e[t])})).then((function(s){var r={address:e[t],indexes:s};h.push(r)}))},s=0;s<20;s++)t(s)})),d.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e);var s=f[Math.floor(Math.random()*f.length)];h.forEach((function(e){d.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,s).send({from:e.address,gas:3e6})}))}));var p=i()();p.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=p}};