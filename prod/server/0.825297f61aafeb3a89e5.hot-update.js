exports.id=0,exports.modules={"./src/server/server.js":function(e,o,t){"use strict";t.r(o);var s=t("./build/contracts/FlightSuretyApp.json"),n=t("./src/server/config.json"),r=t("web3"),c=t.n(r),a=t("express"),l=t.n(a),i=n.localhost,u=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var d=new u.eth.Contract(s.abi,i.appAddress),f=[],h=[0,10,20,30,40,50];u.eth.getAccounts().then((function(e){for(var o=function(o){d.methods.registerOracle().send({from:e[o],value:u.utils.toWei("1","ether"),gas:3e6}).catch((function(e){return console.log("Failed to register oracle: ".concat(e))})).then((function(t){d.methods.getMyIndexes().call({from:e[o]}).then((function(t){console.log("Indexes: ",t);var s={address:e[o],indexes:t};f.push(s)})),console.log("Successfully registered oracle: ",e[o])}))},t=0;t<20;t++)o(t);for(var s=0;s<20;s++){var n="NS"+Math.floor(900*Math.random()+100).toString(),r=Math.floor(Date.now()/1e3);console.log("Flight Number: ",n),d.methods.registerFlight(e[0],n,r).call({from:e[0],gas:3e6}).catch((function(e){return console.log("Failed to register flight: ".concat(e))})).then((function(e){}))}})),d.events.OracleRequest({fromBlock:0},(function(e,o){e&&console.log(e),console.log("Response submitted: ",JSON.stringify(o)),f.forEach((function(e){if(e.indexes.includes(o.index)){var t=h[Math.floor(Math.random()*h.length)];console.log("Random status code: ",t),d.methods.submitOracleResponse(o.index,o.airline,o.flight,o.timestamp,t).send({from:e.address,gas:3e6})}}))}));var g=l()();g.get("/api",(function(e,o){o.send({message:"An API for use with your Dapp!"})})),o.default=g}};