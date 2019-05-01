pragma solidity ^0.5.0;

import "truffle/build/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption{

Adoption adoption = Adoption(DeployedAddresses.Adoption());

uint expectedPetID = 7;

address expectedAdopter = address(this);

function testUserCanAdopt() public {

    uint returnedId = adoption.adoptPet(expectedPetID);
    Assert.equal(returnedId,expectedPetID,"Adoption pet should match with the returned id");
 }

 function testGetAdopter() public{
     address adopter = adoption.adopters(expectedPetID);
     Assert.equal(adopter,expectedAdopter, "Owner of the expected pet should be this contract");
 }

function testAdoptersByID() public{
    address[16] memory adopters = adoption.getAdopters();
    Assert.equal(adopters[expectedPetID],expectedAdopter,"Owner of the expected pet should be this contract");
}

}