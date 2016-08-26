/*
** Darts 101 - Local storage controller
** Using localForage by Mozilla
** https://mozilla.github.io/localForage/
*/
var DARTS101 = DARTS101 || {};

DARTS101.storage = (function (DARTS101) {
  'use strict';
  var db = localforage || undefined;

  // Initiate localforage usage
  db.config({
    name: "DARTS101",
    description: "Storage for Darts101 web application"
  });

  // Initiating the storage
  function initStorage () {
    var storageInitiated;
    db.getItem('storageInitiated', function (error, value) {
      console.log(error);
      console.log(value);
      storageInitiated = value;
      if (storageInitiated && storageInitiated !== null) {
        // There is an instance of DARTS101 storage,
        // Load the storage
        loadStorage();
      } else {
        // First initiate,
        // create the storage model
        createStorage();

        // Set storageInitiated to true
        db.setItem('storageInitiated','true', function (error,value) {
          // Do stuff
        });
      }
    });
  }
  // Loading the required storage
  function loadStorage (name) {
    console.log('Loading storage');
    if (name !== null && typeof name === 'string') {
      console.log(name);
    }
  }
  // Create the storage when empty
  function createStorage () {
    var playerlist = [];
    var players = [];
    console.log('Creating storage');
    db.setItem('playerlist', playerlist);
    db.setItem('players', players);

  }

  initStorage();

  return {
    "info": "Darts101 storage controller",
    "controller": db
  };

})(DARTS101);
