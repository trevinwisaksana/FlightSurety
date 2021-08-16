import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

const maximumNumberOfOracles = 20;
const numberOfFlights = 20;
const oracles = [];
const STATUS_CODES = [0, 10, 20, 30, 40, 50];

web3.eth.getAccounts().then(accounts => {
    for(let a = 0; a < maximumNumberOfOracles; a++) {
        flightSuretyApp.methods.registerOracle().send({from: accounts[a], value: web3.utils.toWei("1",'ether'), gas: 3000000})
        .catch((error) => console.log(`Failed to register oracle: ${error}`))
        .then((result) => {
            flightSuretyApp.methods.getMyIndexes().call({from: accounts[a]})
            .then((indexes) => {
                console.log("Indexes: ", indexes);

                const oracle = {address: accounts[a], indexes: indexes};
                oracles.push(oracle);
            })

            console.log("Successfully registered oracle: ", accounts[a]);
        })
    }

    // The server is also used to register the flights. Ideally there will be a seperate server from the Oracle's.
    flightSuretyApp.methods.fund(accounts[0]).send({from: accounts[0], value: web3.utils.toWei("10",'ether'), gas: 3000000})
    .catch((error) => console.log(`Failed to register airline: ${error}`))
    .then((result) => {
        flightSuretyApp.methods.registerAirline(accounts[0]).send({from: accounts[0], gas: 3000000})
        .catch((error) => console.log(`Failed to register airline: ${error}`))
        .then((result) => {
            for(let a = 0; a < numberOfFlights; a++) {
                const flightNumber = (Math.floor(Math.random() * (1000 - 100) + 100)).toString();
                // Flight number is added to make the timestamp always different
                let timestamp = Math.floor(Date.now() / 1000) + flightNumber;

                flightSuretyApp.methods.registerFlight(accounts[0], "NS" + flightNumber, timestamp).send({from: accounts[0], gas: 3000000})
                .catch((error) => console.log(`Failed to register flight: ${error}`))
                .then((result) => {
                    flightSuretyApp.methods.getFlightNumbers().call()
                    .catch((error) => console.log(`Failed to get flight numbers: ${error}`))
                    .then((flightNumbers) => {
                        console.log("Flight numbers: ", flightNumbers);
                    })
                })
            }
        })
    })
});

flightSuretyApp.events.OracleRequest({fromBlock: 0}, function (error, event) {
    if (error) console.log(error)

    console.log("Response submitted: ", JSON.stringify(event));

    oracles.forEach(oracle => {
        if(oracle.indexes.includes(event.index)) {
            const statusCode = STATUS_CODES[Math.floor(Math.random() * STATUS_CODES.length)];
            console.log("Random status code: ", statusCode);

            flightSuretyApp.methods.submitOracleResponse(event.index, event.airline, event.flight, event.timestamp, statusCode)
            .send({from: oracle.address, gas: 3000000})
        }
    })
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
})

export default app;
