exports.id=0,exports.modules={"./src/server/server.js":function(e,t,s){"use strict";s.r(t);var n=s("./build/contracts/FlightSuretyApp.json"),r=s("./src/server/config.json"),o=s("web3"),a=s.n(o),c=s("express"),i=s.n(c),d=r.localhost,u=new a.a(new a.a.providers.WebsocketProvider(d.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var l=new u.eth.Contract(n.abi,d.appAddress),h=[],f=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var t=function(t){l.methods.registerOracle().send({from:e[t],value:u.utils.toWei("1","ether"),gas:3e6}).then((function(s){l.methods.getMyIndexes().call({from:e[t]})})).then((function(s){var n={address:e[t],indexes:s};h.push(n)}))},s=0;s<20;s++)t(s)})),l.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e);var s=f[Math.floor(Math.random()*f.length)];h.forEach((function(e){e.indexes.includes(t.index),l.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,s).send({from:e.address,gas:3e6})}))}));var p=i()();p.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=p}};