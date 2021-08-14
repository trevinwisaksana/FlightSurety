
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
const Web3 = require('web3');

contract('Flight Surety Tests', async (accounts) => {

    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
    });

    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    it(`(multiparty) has correct initial isOperational() value`, async function () {
        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");
    });

    it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {
        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false, {from: config.secondAirline});
        } catch(e) {
            accessDenied = true;
        }

        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
    });

    it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {
        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false);
        } catch(e) {
            accessDenied = true;
        }

        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
    });

    it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false;
        try {
            await config.flightSurety.setTestingMode(true);
        } catch(e) {
            reverted = true;
        }

        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);
    });

    it('first (airline) registered and funded', async () => {
        let result = await config.flightSuretyData.isAirline(config.firstAirline);
        let hasPaidRegistrationFee = await config.flightSuretyData.hasPaidRegistrationFee(config.firstAirline);

        assert.equal(hasPaidRegistrationFee, true, "First airline should already be set to pay registration fee");
        assert.equal(result, true, "First airline should be registered");
    });

    it('(airline) registers a flight', async () => {
        let timestamp = Math.floor(Date.now() / 1000);

        let didRegisterFlight = true

        try {
            await config.flightSuretyApp.registerFlight(config.firstAirline, config.flightNumber, timestamp);
        } catch(e) {
            didRegisterFlight = true
        }

        let result = await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, config.flightNumber, timestamp);

        assert.equal(didRegisterFlight, true, "Flight failed to be registered");
        assert.equal(result.logs[0].args[2], config.flightNumber, "Flight should be registered");
    });

    it('(airline) cannot register using registerAirline() if it is not funded', async () => {
        var canRegister = true

        try {
            await config.flightSuretyApp.registerAirline(config.thirdAirline, {from: config.secondAirline});
        } catch(e) {
            canRegister = false
        }

        assert.equal(canRegister, false, "Airline should not be able to register another airline if it hasn't provided funding");
    });

    it('(airline) can register second airline', async () => {
        await config.flightSuretyApp.registerAirline(config.secondAirline, {from: config.firstAirline});

        let isSecondAirlineRegistered = await config.flightSuretyData.isAirline(config.secondAirline);

        assert.equal(isSecondAirlineRegistered, true, "First airline is able to register a second airline");
    });

    it('(airline) can register using registerAirline() if it is funded', async () => {
        let registrationFee = Web3.utils.toWei('10', "ether");

        await config.flightSuretyApp.fund(config.secondAirline, {from: config.secondAirline, value: registrationFee, gasPrice: 0});
        let hasPaidRegistrationFee = await config.flightSuretyData.hasPaidRegistrationFee(config.secondAirline);

        await config.flightSuretyApp.registerAirline(config.thirdAirline, {from: config.secondAirline});

        let isThirdAirlineRegistered = await config.flightSuretyData.isAirline(config.thirdAirline);

        assert.equal(hasPaidRegistrationFee, true, "Airline has not provided funding");
        assert.equal(isThirdAirlineRegistered, true, "Airline should be able to register another airline if it has provided funding");
    });

    it('(airline) requires a conensus of 50% to register a flight once there is more than 3 airlines registered', async () => {
        await config.flightSuretyApp.registerAirline(config.fourthAirline, {from: config.firstAirline});
        await config.flightSuretyApp.registerAirline(config.fifthAirline, {from: config.firstAirline});

        let isFifthAirlineRegistered = await config.flightSuretyData.isAirline(config.fifthAirline);
        assert.equal(isFifthAirlineRegistered, false, "Fifth airline should not be registered");

        await config.flightSuretyApp.registerAirline(config.fifthAirline, {from: config.secondAirline});
        let result = await config.flightSuretyData.isAirline(config.fifthAirline);
        assert.equal(result, true, "Fifth airline should be registered");
    });

    it('(passenger) buys flight insurance with 1 eth', async () => {
        let insurancePrice = Web3.utils.toWei('1', "ether");
        let previousBalance = await web3.eth.getBalance(config.passenger);

        await config.flightSuretyApp.buy(config.firstAirline, config.flightNumber, {from: config.passenger, value: insurancePrice, gasPrice: 0});

        let passengers = await config.flightSuretyData.getFlightInsuranceOwners.call(config.firstAirline, config.flightNumber, {from: config.passenger});
        let isPassengerInsured = passengers.includes(config.passenger);

        let updatedBalance = await web3.eth.getBalance(config.passenger);
        let balanceDifference = previousBalance - updatedBalance;

        assert.equal(isPassengerInsured, true, "Passenger address does not match");
        assert.equal(balanceDifference, insurancePrice, "Balance deducted is not correct");
    });

    it('eligible (passenger) should have credit to withdraw', async () => {
        await config.flightSuretyData.creditInsurees(config.firstAirline, config.flightNumber);

        let result = await config.flightSuretyData.getPassengerCredit.call(config.passenger);

        let insurancePrice = Web3.utils.toWei('1', "ether");
        let multipliedAmount = insurancePrice * 1.5;

        assert.equal(result, multipliedAmount, "Passenger does not match the exepected value");
    });

    it('eligible (passenger) can withdraw', async () => {
        let previousBalance = await web3.eth.getBalance(config.passenger);

        await config.flightSuretyApp.withdraw({from: config.passenger, gasPrice: 0});

        let updatedBalance = await web3.eth.getBalance(config.passenger);
        let balanceDifference = updatedBalance - previousBalance;

        let expectedDiffernce = Web3.utils.toWei('1.5', "ether");

        assert.equal(balanceDifference, expectedDiffernce, "Balance difference does not match the exepected value");
    });

    it('can update (flight) status', async () => {
        let timestamp = Math.floor(Date.now() / 1000);
        await config.flightSuretyData.updateFlightStatus(config.firstAirline, config.flightNumber, timestamp, 10);

        let result = await config.flightSuretyData.getFlightStatus(config.firstAirline, config.flightNumber, timestamp);
        assert.equal(result, 10, "Flight status should be updated");
    });

});
