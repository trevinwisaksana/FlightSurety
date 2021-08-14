pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

interface IFlightSuretyData {
    function registerAirline(address airline) external;
    function numberOfAirlines() returns(uint);
    function isOperational() view external returns(bool);
    function registerFlight(address airline, string flight, uint256 timestamp) external;
    function fund(address airline) public payable;
    function buy(address passenger, address airline, string flight) external payable;
    function pay(address passenger) external;
    function hasPaidRegistrationFee(address airline) view external returns(bool);
    function updateFlightStatus(address airline, string flight, uint256 timestamp, uint8 statusCode) external;
    function voteToRegisterAirline(address airline) external;
    function getNumberOfRegistrationVotes(address airline) external returns(uint);
}

contract FlightSuretyData is IFlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    struct Airline {
        bool isRegistered;
        bool hasPaidRegistrationFee;
        mapping(string => uint) flightSKUs;
    }

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint sku;
        uint256 updatedTimestamp;
        address airline;
    }

    enum InsuranceState {
        Active,
        Credited,
        Expired
    }

    struct FlightInsurance {
        uint sku;
        address[] passengers;  // Metamask-Ethereum address of passengers
        address airline; // The airline of the insured flight
        string flight; // The flight number
        uint price; // Product Price
        InsuranceState state;  // Insurance state as represented in the enum above
    }

    address private contractOwner; // Account used to deploy contract
    bool private operational = true; // Blocks all state changes throughout the contract if false

    uint flightSKU = 1; // Sku stands for Stock Keeping Unit
    uint airlineSKU = 1; // Sku stands for Stock Keeping Unit
    uint private insurancePrice = 1 ether; // The price of the flight insurance
    uint private insurancePrice = 1 ether; // The price of the flight insurance
    string[] flightNumbers; // Lists all the flight numbers so it can be displayed

    // Track all registered airlines
    mapping(address => Airline) private airlines;
    // Track all registered flights
    mapping(bytes32 => Flight) private flights;
    // Track all the existing insurance
    mapping(uint => FlightInsurance) private insurances;
    // References the flight number with the flight insurance
    mapping(string => uint) private flightNumberToFlightSKU;
    // Keeps track of how much credit each passenger can withdraw
    mapping(address => uint256) private passengerCredits;
    // Keeps track of the airline registered to vote
    mapping(address => uint) private airlineRegistrationVotes;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor(address firstAirline) public {
        contractOwner = msg.sender;

        // Set first airline
        airlines[firstAirline].isRegistered = true;
        airlines[firstAirline].hasPaidRegistrationFee = true;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireAnAirline() {
        require(airlines[msg.sender].isRegistered == true, "Airline must be registered");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireTenEther()
    {
        require(msg.value >= 10, "Airline must pay at least 10 ether");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */
    function isOperational() view external returns(bool) {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */
    function registerAirline(address airline) external
        requireIsOperational
    {
        require(!airlines[airline].isRegistered, "Airline is already registered.");

        airlines[airline] = Airline(true, false);
        airlineSKU = airlineSKU.add(1);
    }

    /**
    * @dev Returns the number of airlines that are registered
    *
    */
    function numberOfAirlines()
        requireIsOperational
        returns(uint)
    {
        return airlineSKU;
    }

    /**
    * @dev checks if the address is an airline registered
    *
    */
    function isAirline(address airline) view external
        returns(bool)
    {
        return airlines[airline].isRegistered;
    }

    /**
    * @dev Add vote to register airline
    *
    */
    function voteToRegisterAirline(address airline) external {
        uint currentNumberOfVotes = airlineRegistrationVotes[airline];
        airlineRegistrationVotes[airline] = currentNumberOfVotes.add(1);
    }

    /**
    * @dev Add vote to register airline
    *
    */
    function getNumberOfRegistrationVotes(address airline) external
        returns(uint)
    {
        return airlineRegistrationVotes[airline];
    }

    /**
    * @dev Add a flight to the flights mapping
    *
    */
    function registerFlight(address airline, string flight, uint256 timestamp) external
        requireIsOperational
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);

        flights[flightKey] = Flight(true, 0, flightSKU, timestamp, airline);
        airlines[airline].flightSKUs[flight] = flightSKU;
        flightNumberToFlightSKU[flight] = flightSKU;

        _createFlightInsurance(airline, flight);
    }

    /**
    * @dev Returns the flight numbers of the flights registered
    *
    */
    function getFlightNumbers()
        requireIsOperational
        returns(string[])
    {
        return flights;
    }

    /**
    * @dev Add a flight insurance to the insurances mapping
    *
    */
    function _createFlightInsurance(address airline, string flight) internal {
        insurances[flightSKU].sku = flightSKU;
        insurances[flightSKU].airline = airline;
        insurances[flightSKU].flight = flight;
        insurances[flightSKU].price = insurancePrice;
        insurances[flightSKU].state = InsuranceState.Active;

        // Increment the SKU
        flightSKU = flightSKU.add(1);
    }

    /**
    * @dev Buy insurance for a flight
    *
    */
    function buy(address passenger, address airline, string flight) external payable
        requireIsOperational
    {
        uint sku = airlines[airline].flightSKUs[flight];
        insurances[sku].passengers.push(passenger);

        contractOwner.transfer(msg.value);
    }

    /**
    * @dev Get flight insurance passenger addresses. This is used for unit testing.
    *
    */
    function getFlightInsuranceOwners(address airline, string flight) view external returns(address[]) {
        uint sku = airlines[airline].flightSKUs[flight];
        return insurances[sku].passengers;
    }

    /**
    *  @dev Credits payouts to insurees
    */
    function creditInsurees(address airline, string flight) requireIsOperational external {
        uint sku = airlines[airline].flightSKUs[flight];
        uint price = insurances[sku].price;
        address[] passengers = insurances[sku].passengers;

        for (uint i=0; i < passengers.length; i++) {
            address passenger = passengers[i];
            uint256 currentCredit = passengerCredits[passenger];
            uint256 credit = currentCredit.add(price.mul(15).div(10));
            passengerCredits[passenger] = credit;
        }

        insurances[sku].state = InsuranceState.Credited;
    }

    /**
    *  @dev Credits payouts to insurees
    */
    function getPassengerCredit(address passenger) requireIsOperational external returns(uint256) {
        return passengerCredits[passenger];
    }

    /**
    *  @dev Transfers eligible payout funds to insuree
    *
    */
    function pay(address passenger) external {
        uint256 passengerCreditAmount = passengerCredits[passenger];
        require(passengerCreditAmount > 0, "Passenger does not have enough credit");
        require(this.balance > 0, "Contract does not have enough credit");

        passengerCredits[passenger] = 0;
        passenger.transfer(passengerCreditAmount);
    }

    /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */
    function fund(address airline) public payable {
        airlines[airline].hasPaidRegistrationFee = true;
    }

    /**
    * @dev checks if the airline has paid registration fee
    *
    */
    function hasPaidRegistrationFee(address airline) view external returns(bool) {
        return airlines[airline].hasPaidRegistrationFee;
    }

    /**
    * @dev checks if the airline has paied registration fee
    *
    */
    function updateFlightStatus(address airline, string flight, uint256 timestamp, uint8 statusCode) external {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        flights[flightKey].statusCode = statusCode;
    }

    /**
    * @dev Gets the status of the flight
    *
    */
    function getFlightStatus(address airline, string flight, uint256 timestamp) view external returns(uint8) {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        return flights[flightKey].statusCode;
    }

    /**
    * @dev Creates a flight key using the airline, flight number and timestamp
    *
    */
    function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() external payable {
        fund(msg.sender);
    }

}
