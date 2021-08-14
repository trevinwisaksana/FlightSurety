exports.id=0,exports.modules={"./src/server/server.js":function(e,t,s){"use strict";s.r(t);var r=s("./build/contracts/FlightSuretyApp.json"),n=s("./src/server/config.json"),o=s("web3"),a=s.n(o),c=s("express"),i=s.n(c),u=n.localhost,d=new a.a(new a.a.providers.WebsocketProvider(u.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var l=new d.eth.Contract(r.abi,u.appAddress),h=[],f=[0,10,20,30,40,50];d.eth.getAccounts().then((function(e){for(var t=function(t){l.methods.registerOracle().send({from:e[t],value:d.utils.toWei("1","ether"),gas:3e6}).then((function(s){l.methods.getMyIndexes().call({from:e[t]})})).then((function(s){var r={address:e[t],indexes:s};h.push(r)}))},s=0;s<20;s++)t(s)})),l.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e);var s=f[Math.floor(Math.random()*f.length)];h.forEach((function(e){l.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,s).send({from:e.address,gas:3e6})}))}));var p=i()();p.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=p}};