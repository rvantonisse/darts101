/* game-report.js */
var DARTS101 = DARTS101 || {};
DARTS101.gameReport = (function (DARTS101) {
  var help = DARTS101.helpers;
  var template = {
    "container": help.el('.game-report-container'),
    "confirmButton": help.el('.game-report button')
  };

  function displayGameReport () {
    template.container.dataset.isDisplayed = "true";
  }

  template.confirmButton.addEventListener('click', function (e) {
    // Set report container to not display
    template.container.dataset.isDisplayed = "false";
  }, false);

  return {
    "displayGameReport": displayGameReport
  };
});

// Load when needed
if (DARTS101.helpers.el('.game-report')) {
    DARTS101.gameReport = DARTS101.gameReport(DARTS101);
};
