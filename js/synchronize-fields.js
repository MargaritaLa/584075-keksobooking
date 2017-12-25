'use strict';

(function () {

  window.synchronizeFields = function (dependentFieldFirst, ratioDependency, synchronizationFields, dependentFieldSecond) {

    if (typeof dependentFieldSecond === 'undefined') {
      dependentFieldSecond = [];
    }

    synchronizationFields(dependentFieldFirst.value, dependentFieldSecond, ratioDependency);

  };

})();
