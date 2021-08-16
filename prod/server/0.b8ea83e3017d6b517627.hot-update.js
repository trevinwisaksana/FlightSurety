exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var n=o("./build/contracts/FlightSuretyApp.json"),s=o("./src/server/config.json"),r=o("web3"),c=o.n(r),l=o("express"),a=o.n(l),i=s.localhost,u=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var d=new u.eth.Contract(n.abi,i.appAddress),h=[],f=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var t=function(t){d.methods.registerOracle().send({from:e[t],value:u.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){d.methods.getMyIndexes().call({from:e[t]}).then((function(o){console.log("Indexes: ",o);var n={address:e[t],indexes:o};h.push(n)})),console.log("Successfully registered oracle: ",e[t])}))},o=0;o<20;o++)t(o);for(var n=0;n<20;n++){var s="NS"+Math.floor(900*Math.random()+100).toString(),r=Math.floor(Date.now()/1e3);d.methods.registerFlight(e[0],s,r).call({from:e[0]}).catch((function(e){return console.log("Failed to register flight: ".concat(e))})).then((function(e){d.methods.getFlightNumbers().call().catch((function(e){return console.log("Failed to get flight numbers: ".concat(e))})).then((function(e){console.log("Flight numbers: ",e)}))}))}})),d.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(t)),h.forEach((function(e){if(e.indexes.includes(t.index)){var o=f[Math.floor(Math.random()*f.length)];console.log("Random status code: ",o),d.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,o).send({from:e.address,gas:3e6})}}))}));var g=a()();g.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=g}};