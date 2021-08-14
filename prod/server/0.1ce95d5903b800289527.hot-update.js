exports.id=0,exports.modules={"./src/server/server.js":function(e,o,s){"use strict";s.r(o);var t=s("./build/contracts/FlightSuretyApp.json"),n=s("./src/server/config.json"),r=s("web3"),c=s.n(r),l=s("express"),a=s.n(l),i=n.localhost,d=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var u=new d.eth.Contract(t.abi,i.appAddress),f=[],h=[0,10,20,30,40,50];d.eth.getAccounts().then((function(e){for(var o=function(o){u.methods.registerOracle().send({from:e[o],value:d.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(s){u.methods.getMyIndexes().call({from:e[o]}).then((function(s){console.log("Indexes: ",s);var t={address:e[o],indexes:s};f.push(t)})),console.log("Successfully registered oracle: ",e[o])}))},s=0;s<20;s++)o(s);for(var t=function(o){var s=Math.floor(900*Math.random()+100);console.log("Flight Number: ",s),u.methods.registerFlight().catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(s){u.methods.getMyIndexes().call({from:e[o]}).then((function(s){console.log("Indexes: ",s);var t={address:e[o],indexes:s};f.push(t)})),console.log("Successfully registered oracle: ",e[o])}))},n=0;n<20;n++)t(n)})),u.events.OracleRequest({fromBlock:0},(function(e,o){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(o)),f.forEach((function(e){if(e.indexes.includes(o.index)){var s=h[Math.floor(Math.random()*h.length)];console.log("Random status code: ",s),u.methods.submitOracleResponse(o.index,o.airline,o.flight,o.timestamp,s).send({from:e.address,gas:3e6})}}))}));var g=a()();g.get("/api",(function(e,o){o.send({message:"An API for use with your Dapp!"})})),o.default=g}};