'use strict';

(function () {

  window.synchronizeFields = function (dependentFieldFirst, ratioDependency, synchronizationFields, dependentFieldSecond) {

    if (typeof dependentFieldSecond === 'undefined') {
      dependentFieldSecond = [];
    }

    for (var i = 0; i <= dependentFieldFirst.length - 1; i++) {
      synchronizationFields(dependentFieldFirst.value, dependentFieldSecond, ratioDependency);
    }

  };


})();
