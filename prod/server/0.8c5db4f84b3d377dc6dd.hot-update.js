exports.id=0,exports.modules={"./src/server/server.js":function(e,o,t){"use strict";t.r(o);var s=t("./build/contracts/FlightSuretyApp.json"),n=t("./src/server/config.json"),r=t("web3"),c=t.n(r),l=t("express"),a=t.n(l),i=n.localhost,d=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var u=new d.eth.Contract(s.abi,i.appAddress),f=[],h=[0,10,20,30,40,50];d.eth.getAccounts().then((function(e){for(var o=function(o){u.methods.registerOracle().send({from:e[o],value:d.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(t){u.methods.getMyIndexes().call({from:e[o]}).then((function(t){console.log("Indexes: ",t);var s={address:e[o],indexes:t};f.push(s)})),console.log("Successfully registered oracle: ",e[o])}))},t=0;t<20;t++)o(t);for(var s=function(o){Math.floor(Math.random()*h.length);u.methods.registerFlight().catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(t){u.methods.getMyIndexes().call({from:e[o]}).then((function(t){console.log("Indexes: ",t);var s={address:e[o],indexes:t};f.push(s)})),console.log("Successfully registered oracle: ",e[o])}))},n=0;n<20;n++)s(n)})),u.events.OracleRequest({fromBlock:0},(function(e,o){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(o)),f.forEach((function(e){if(e.indexes.includes(o.index)){var t=h[Math.floor(Math.random()*h.length)];console.log("Random status code: ",t),u.methods.submitOracleResponse(o.index,o.airline,o.flight,o.timestamp,t).send({from:e.address,gas:3e6})}}))}));var g=a()();g.get("/api",(function(e,o){o.send({message:"An API for use with your Dapp!"})})),o.default=g}};