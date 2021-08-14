exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var s=o("./build/contracts/FlightSuretyApp.json"),n=o("./src/server/config.json"),r=o("web3"),c=o.n(r),a=o("express"),l=o.n(a),i=n.localhost,u=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var d=new u.eth.Contract(s.abi,i.appAddress),f=[],h=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var t=function(t){d.methods.registerOracle().send({from:e[t],value:u.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){d.methods.getMyIndexes().call({from:e[t]}),console.log("Successfully registered oracle: ",e[t])})).then((function(o){var s={address:e[t],indexes:o};f.push(s)}))},o=0;o<20;o++)t(o)})),d.events.OracleRequest({fromBlock:0},(function(e,t){if(e&&console.log(e),!t.returnValues)return console.log("No return value in event");null!=t&&f.forEach((function(e){var o=h[Math.floor(Math.random()*h.length)];console.log("Random status code: ",o),console.log("Response submitted: ",JSON.stringify(t)),d.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,o).send({from:e.address,gas:3e6})}))}));var g=l()();g.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=g}};