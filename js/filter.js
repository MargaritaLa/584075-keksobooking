'use strict';

(function () {

  var formFilter = document.querySelector('.map__filters');

  window.filterUtils = {

    getSelectsFiltersList: function () {

      var arraySelects = [];

      var filtersSelects = document.querySelectorAll('.map__filters select');

      for (var i = 0; i < filtersSelects.length; i++) {

        var nameSelect = filtersSelects[i].getAttribute('name').split('-')[1];
        if (filtersSelects[i].nodeType === 1) {
          arraySelects.push([nameSelect, filtersSelects[i].options[filtersSelects[i].selectedIndex].value]);
        }
      }

      return arraySelects;
    },

    getCheckboxesFiltersList: function () {

      var arrayFeatures = [];

      var filtersCheckboxes = document.querySelectorAll('#housing-features input[type="checkbox"]');

      for (var i = 0; i < filtersCheckboxes.length; i++) {
        if (filtersCheckboxes[i].checked) {
          arrayFeatures.push(filtersCheckboxes[i].value);
        }
      }

      return arrayFeatures;
    },

    launchFilter: function () {

      var sourceObjects = window.data.cardObjectsArray;
      var filteredObjects = [];

      var selectsFilters = window.filterUtils.getSelectsFiltersList();
      var checkboxFilters = window.filterUtils.getCheckboxesFiltersList();

      for (var i = 0; i < sourceObjects.length; i++) {

        var object = sourceObjects[i];
        var isSatisfy = true;

        for (var checkboxFilterIdx = 0; checkboxFilterIdx < checkboxFilters.length; checkboxFilterIdx++) {
          var checkboxFilter = checkboxFilters[checkboxFilterIdx];
          if (!object.offer.features.includes(checkboxFilter)) {
            break;
          }
        }

        if (isSatisfy) {
          for (var selectFilterIdx = 0; selectFilterIdx < selectsFilters.length; selectFilterIdx++) {
            var selectFilter = selectsFilters[selectFilterIdx];
            if (!isSatisfySelectFilter(selectFilter, object)) {
              isSatisfy = false;
              break;
            }
          }
        }

        if (isSatisfy) {
          filteredObjects.push(object);
        }

      }

      window.pinsUtils.deletePins();
      window.pinsUtils.renderPins(filteredObjects);

    }

  };

  function isSatisfySelectFilter(selectFilter, object) {
    var selectName = selectFilter[0];
    var selectedOption = selectFilter[1];
    switch (selectName) {
      case 'type':
        return selectedOption === 'any' ? true : object.offer.type === selectedOption;
      case 'price':
        if (selectedOption === 'middle') {
          return (object.offer.price < 10000 && object.offer.price <= 50000);
        }
        if (selectedOption === 'low') {
          return (object.offer.price <= 10000);
        }
        if (selectedOption === 'high') {
          return (object.offer.price >= 50000);
        }
        if (selectedOption === 'any') {
          return true;
        }
        break;
      case 'rooms':
        return selectedOption === 'any' ? true : object.offer.rooms.toString() === selectedOption;
      case 'guests':
        return selectedOption === 'any' ? true : object.offer.guests.toString() === selectedOption;
    }

    return false;
  }

  formFilter.addEventListener('change', function () {
    window.debounce(function () {
      window.cardsUtils.closePopup();
      window.filterUtils.launchFilter();
    });
  });

})();
