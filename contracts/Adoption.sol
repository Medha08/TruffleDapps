pragma solidity ^0.5.0;

contract Adoption{

    address[16] public adopters;
    address public owner;

   constructor()public{
       owner = msg.sender;
   }

   function adoptPet(uint _petId) public returns (uint){
       require(_petId >=0  && _petId<= 15);
        adopters[_petId] =msg.sender;
        return _petId;
   }

   function getAdopters() public view returns(address[16] memory){
       return adopters;
   }

}