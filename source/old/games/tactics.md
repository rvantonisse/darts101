# Tactics
  =======

A game to throw the numbers of the dartsboard. Standard from 20 to 10 and the bull.
Each number has to be hit 3 times.
In multiple player mode, scores can be added to the game for more complexity. Points can be gained by
hitting a full number the opponent still needs to fill.

## Game flow

* each turn 3 darts are thrown to score
* each thrown dart is submitted independendly by clicking either no score or the number and the type (single, double, triple)
* After each score the scoreboard is updated.
* After 3 scores the turn ends
* If the scoreboard is full 
	> In single player the game ends
	> In multi player also additional win conditions are checked, if met the game ends.

## User stories

* a dartsplayer needs to see the scoreboard
* a dartsplayer needs to know the opponents scoreboard
* a dartsplayer needs to be able to undo wrong input