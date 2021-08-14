exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var s=o("./build/contracts/FlightSuretyApp.json"),r=o("./src/server/config.json"),n=o("web3"),c=o.n(n),a=o("express"),u=o.n(a),l=r.localhost,i=new c.a(new c.a.providers.WebsocketProvider(l.url.replace("http","ws")));i.eth.defaultAccount=i.eth.accounts[0];var d=new i.eth.Contract(s.abi,l.appAddress),f=[];i.eth.getAccounts().then((function(e){for(var t=function(t){d.methods.registerOracle().send({from:e[t],value:i.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){d.methods.getMyIndexes().call({from:e[t]}),console.log("Successfully registered oracle: ",e[t])})).then((function(o){var s={address:e[t],indexes:o};f.push(s)}))},o=0;o<20;o++)t(o)})),d.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e),f.forEach((function(e){console.log("Random status code: ",statusCode)}))}));var h=u()();h.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=h}};