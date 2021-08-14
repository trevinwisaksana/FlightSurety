exports.id=0,exports.modules={"./src/server/server.js":function(e,t,s){"use strict";s.r(t);var r=s("./build/contracts/FlightSuretyApp.json"),o=s("./src/server/config.json"),n=s("web3"),c=s.n(n),a=s("express"),i=s.n(a),l=o.localhost,u=new c.a(new c.a.providers.WebsocketProvider(l.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var d=new u.eth.Contract(r.abi,l.appAddress),f=[],h=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var t=function(t){d.methods.registerOracle().send({from:e[t],value:u.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(s){d.methods.getMyIndexes().call({from:e[t]}),console.log("Successfully registered oracle: ",e[t])})).then((function(s){var r={address:e[t],indexes:s};f.push(r)}))},s=0;s<20;s++)t(s)})),d.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e),f.forEach((function(e){var s=h[Math.floor(Math.random()*h.length)];d.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,s).send({from:e.address,gas:3e6})}))}));var g=i()();g.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=g}};