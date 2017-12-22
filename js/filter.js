'use strict';

(function () {


  var formFilter = document.querySelector('.map__filters');
  var filtersCheckboxes = document.querySelectorAll('#housing-features input[type="checkbox"]');


  // функционал фильтра
  window.filterUtils = {

    getSelectsFiltersList: function () {

      var arraySelects = [];

      var filtersSelects = document.querySelectorAll('.map__filters select');

      for (var i = 0; i < filtersSelects.length; i++) {

        var nameSelect = filtersSelects[i].getAttribute('name').split('-')[1];
        var filtersSelect = filtersSelects[i];

        if (filtersSelect.nodeType === 1) {
          arraySelects.push([nameSelect, filtersSelect.options[filtersSelect.selectedIndex].value]);
        }

      }

      return arraySelects;
    },

    getCheckboxesFiltersList: function () {

      var arrayFeatures = [];

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

        var checkingHouse = sourceObjects[i];
        var isSatisfyCheckboxFilters = true;
        var isSatisfySelectFilters = true;

        // for (var checkboxFilterIdx = 0; checkboxFilterIdx < checkboxFilters.length; checkboxFilterIdx++) {
        //   var checkboxFilter = checkboxFilters[checkboxFilterIdx];
        //   if (!checkHousing.offer.features.includes(checkboxFilter)) {
        //     isSatisfyCheckboxFilters = false;
        //     break;
        //   }
        // }

        isSatisfyCheckboxFilters = checkboxFilters.every(function (checkboxFilter) {
          return isSatisfyCheckboxFilter(checkboxFilter, checkingHouse);
        });

        isSatisfySelectFilters = selectsFilters.every(function (selectFilter) {
          return isSatisfySelectFilter(selectFilter, checkingHouse);
        });

        if (isSatisfyCheckboxFilters && isSatisfySelectFilters) {
          filteredObjects.push(checkingHouse);
        }
      }

      window.pinsUtils.deletePins();
      window.pinsUtils.renderPins(filteredObjects);

    }

  };

  function isSatisfyCheckboxFilter(checkboxFilter, object) {
    return object.offer.features.includes(checkboxFilter);
  }

  function isSatisfySelectFilter(selectFilter, object) {

    var selectName = selectFilter[0];
    var selectedOption = selectFilter[1];

    switch (selectName) {
      case 'type':
        return selectedOption === 'any' ? true : object.offer.type === selectedOption;
      case 'price':
        if (selectedOption === 'middle') {
          return (object.offer.price > 10000 && object.offer.price < 50000);
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
