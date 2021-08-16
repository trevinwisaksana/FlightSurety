exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var n=o("./build/contracts/FlightSuretyApp.json"),s=o("./build/contracts/FlightSuretyData.json"),r=o("./src/server/config.json"),a=o("web3"),c=o.n(a),i=o("express"),l=o.n(i),u=r.localhost,d=new c.a(new c.a.providers.WebsocketProvider(u.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var g=new d.eth.Contract(n.abi,u.appAddress),h=(new d.eth.Contract(s.abi,u.dataAddress),[]),f=[0,10,20,30,40,50];d.eth.getAccounts().then((function(e){for(var t=function(t){g.methods.registerOracle().send({from:e[t],value:d.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){g.methods.getMyIndexes().call({from:e[t]}).then((function(o){console.log("Indexes: ",o);var n={address:e[t],indexes:o};h.push(n)})),console.log("Successfully registered oracle: ",e[t])}))},o=0;o<20;o++)t(o);for(var n=0;n<20;n++){var s="NS"+Math.floor(900*Math.random()+100).toString(),r=Date().getMonth()+8,a=Date(start.getTime()+Math.random()*(r.getTime()-Date().getTime())).toString();g.methods.registerFlight(e[0],s,a).call({from:e[0],gas:3e6}).catch((function(e){return console.log("Failed to register flight: ".concat(e))})).then((function(e){g.methods.getFlightNumbers().call().catch((function(e){return console.log("Failed to get flight numbers: ".concat(e))})).then((function(e){console.log("Flight numbers: ",e)}))}))}})),g.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(t)),h.forEach((function(e){if(e.indexes.includes(t.index)){var o=f[Math.floor(Math.random()*f.length)];console.log("Random status code: ",o),g.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,o).send({from:e.address,gas:3e6})}}))}));var m=l()();m.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=m}};