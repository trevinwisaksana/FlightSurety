exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var n=o("./build/contracts/FlightSuretyApp.json"),s=o("./build/contracts/FlightSuretyData.json"),r=o("./src/server/config.json"),c=o("web3"),l=o.n(c),a=o("express"),i=o.n(a),u=r.localhost,h=new l.a(new l.a.providers.WebsocketProvider(u.url.replace("http","ws")));h.eth.defaultAccount=h.eth.accounts[0];var g=new h.eth.Contract(n.abi,u.appAddress),d=(new h.eth.Contract(s.abi,u.dataAddress),[]),f=[0,10,20,30,40,50];h.eth.getAccounts().then((function(e){for(var t=function(t){g.methods.registerOracle().send({from:e[t],value:h.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(o){g.methods.getMyIndexes().call({from:e[t]}).then((function(o){console.log("Indexes: ",o);var n={address:e[t],indexes:o};d.push(n)})),console.log("Successfully registered oracle: ",e[t])}))},o=0;o<20;o++)t(o);g.methods.registerAirline(e[0],"NS"+flightNumber,timestamp).send({from:e[0],gas:3e6}).catch((function(e){return console.log("Failed to register flight: ".concat(e))})).then((function(e){g.methods.getFlightNumbers().call().catch((function(e){return console.log("Failed to get flight numbers: ".concat(e))})).then((function(e){console.log("Flight numbers: ",e)}))}));for(var n=0;n<20;n++){var s=Math.floor(900*Math.random()+100).toString(),r=Math.floor(Date.now()/1e3)+s;g.methods.registerFlight(e[0],"NS"+s,r).send({from:e[0],gas:3e6}).catch((function(e){return console.log("Failed to register flight: ".concat(e))})).then((function(e){g.methods.getFlightNumbers().call().catch((function(e){return console.log("Failed to get flight numbers: ".concat(e))})).then((function(e){console.log("Flight numbers: ",e)}))}))}})),g.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(t)),d.forEach((function(e){if(e.indexes.includes(t.index)){var o=f[Math.floor(Math.random()*f.length)];console.log("Random status code: ",o),g.methods.submitOracleResponse(t.index,t.airline,t.flight,t.timestamp,o).send({from:e.address,gas:3e6})}}))}));var m=i()();m.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=m}};