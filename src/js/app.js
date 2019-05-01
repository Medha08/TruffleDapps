App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
   
    if(window.etherum){
      App.web3Provider = window.etherum;
      try{
        await window.etherum.enable();
      }catch(error){
        console.error("User denied account access")
      }
    }else if(window.web3){
      App.web3Provider = window.web3.currentProvider;
    }else{
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
   
    $.getJSON("Adoption.json",function(data){

      var AdoptionArtifact = data;
      //creates an instance of a contract to interact with
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();

    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {

    var adoptionInstance;
    App.contract.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adotpters){
      for(i=0;i<adopters.length;i++){
        if(adopters[i] !== '0x0000000000000000000000000000000000000000' ){
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err){
      console.log(err.message);
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(err,accounts){
      if(error){
        console.log(error);
      }

      var account = accounts[0];
      App.contract.Adoption.deployed().then(function(instance){
        
        adoptionInstance = instance;

        return adoptionInstance.adoptPet(petId,{from:account}).then(function(result){
          return App.markAdopted();
        }).catch(function(err){
          console.log(err.message);
        })
  
      });

    });
   
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
