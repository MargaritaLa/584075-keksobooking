'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500; // ms

  var lastTimeout;

  window.debounce = function (fun) {
	  
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
	
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
	
  };

})();
