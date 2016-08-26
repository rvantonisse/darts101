/* players.js */
var DARTS101 = DARTS101 || {};
DARTS101.players = (function (DARTS101) {
  'use strict';
  /*
  This is the players' model and controller. This should create, edit and remove player
  objects from the application. The player object that is created here should
  contain all player specific information like: name, matches played,
  statistics and default settings.
  */

  // playerlist.
  var playerlist = [];

  // player constructor
  function Player (name) {
    this.name = name;
    this.matches = [];
    this.statistics = {};
  }

  // add a player
  function addPlayer () {

    // Add the player as new Playerobject to players

    // Add the player to the playerlist when players is stored locally
  }

  // edit a player
  function editPlayer (name) {}

  // remove a player.
  function removePlayer (name) {}


});
