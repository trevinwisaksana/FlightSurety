exports.id=0,exports.modules={"./src/server/server.js":function(e,s,o){"use strict";o.r(s);var t=o("./build/contracts/FlightSuretyApp.json"),n=o("./src/server/config.json"),r=o("web3"),c=o.n(r),a=o("express"),i=o.n(a),l=n.localhost,d=new c.a(new c.a.providers.WebsocketProvider(l.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var u=new d.eth.Contract(t.abi,l.appAddress),f=[],h=[0,10,20,30,40,50];d.eth.getAccounts().then((function(e){for(var s=function(s){u.methods.registerOracle().send({from:e[s],value:d.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){u.methods.getMyIndexes().call({from:e[s]}).then((function(o){console.log("Indexes: ",o);var t={address:e[s],indexes:o};f.push(t)})),console.log("Successfully registered oracle: ",e[s])}))},o=0;o<20;o++)s(o)})),u.events.OracleRequest({fromBlock:0},(function(e,s){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(s)),f.forEach((function(e){if(e.indexes.includes(s.index)){var o=h[Math.floor(Math.random()*h.length)];console.log("Random status code: ",o),u.methods.submitOracleResponse(s.index,s.airline,s.flight,s.timestamp,o).send({from:e.address,gas:3e6})}}))}));var g=i()();g.get("/api",(function(e,s){s.send({message:"An API for use with your Dapp!"})})),s.default=g}};