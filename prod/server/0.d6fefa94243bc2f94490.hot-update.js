exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var s=o("./build/contracts/FlightSuretyApp.json"),n=o("./build/contracts/FlightSuretyData.json"),r=o("./src/server/config.json"),a=o("web3"),c=o.n(a),l=o("express"),i=o.n(l),d=r.localhost,u=new c.a(new c.a.providers.WebsocketProvider(d.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var h=new u.eth.Contract(s.abi,d.appAddress),f=(new u.eth.Contract(n.abi,d.dataAddress),[]),g=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var t=function(t){h.methods.registerOracle().send({from:e[t],value:u.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){h.methods.getMyIndexes().call({from:e[t]}).then((function(o){console.log("Indexes: ",o);var s={address:e[t],indexes:o};f.push(s)})),console.log("Successfully registered oracle: ",e[t])}))},o=0;o<20;o++)t(o);for(var s=0;s<20;s++){var n="NS"+Math.floor(900*Math.random()+100).toString(),r=Math.floor(Date.now()/1e3);console.log("Flight number: ",n),h.methods.registerFlight(e[0],n,r).call({from:e[0],gas:3e6}).catch((function(e){return console.log("Failed to register flight: ".concat(e))})).then((function(e){}))}})),h.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(t)),f.forEach((function(e){if(e.indexes.includes(t.index)){var o=g[Math.floor(Math.random()*g.length)];console.log("Random status code: ",o),h.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,o).send({from:e.address,gas:3e6})}}))}));var m=i()();m.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=m}};