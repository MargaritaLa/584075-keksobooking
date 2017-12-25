'use strict';

(function () {


  var formFilter = document.querySelector('.map__filters');
  var filtersCheckboxes = document.querySelectorAll('#housing-features input[type="checkbox"]');


  // функционал фильтра
  window.filterUtils = {

    getSelectsFiltersList: function () {

      var arraySelects = [];

      var filtersSelectsArray = document.querySelectorAll('.map__filters select');

      filtersSelectsArray.forEach(function (filtersSelectItem) {

        var nameSelect = filtersSelectItem.getAttribute('name').split('-')[1];
        var filtersSelect = filtersSelectItem;

        if (filtersSelect.nodeType === 1) {
          arraySelects.push([nameSelect, filtersSelect.options[filtersSelect.selectedIndex].value]);
        }

      });

      return arraySelects;
    },

    getCheckboxesFiltersList: function () {

      var arrayFeatures = [];

      filtersCheckboxes.forEach(function (filtersCheckboxItem) {

        if (filtersCheckboxItem.checked) {
          arrayFeatures.push(filtersCheckboxItem.value);
        }

      });

      return arrayFeatures;
    },

    launchFilter: function () {

      var sourceObjects = window.data.cardObjectsArray;
      var filteredObjects = [];

      var selectsFilters = window.filterUtils.getSelectsFiltersList();

      var checkboxFilters = window.filterUtils.getCheckboxesFiltersList();

      sourceObjects.forEach(function (checkingHouse) {

        var isSatisfyCheckboxFilters = true;
        var isSatisfySelectFilters = true;

        isSatisfyCheckboxFilters = checkboxFilters.every(function (checkboxFilter) {
          return window.filterUtils.isSatisfyCheckboxFilter(checkboxFilter, checkingHouse);
        });

        isSatisfySelectFilters = selectsFilters.every(function (selectFilter) {
          return window.filterUtils.isSatisfySelectFilter(selectFilter, checkingHouse);
        });

        if (isSatisfyCheckboxFilters && isSatisfySelectFilters) {
          filteredObjects.push(checkingHouse);
        }

      });

      window.pinsUtils.deletePins();
      window.pinsUtils.renderPins(filteredObjects);

    },

    isSatisfyCheckboxFilter: function (checkboxFilter, object) {
      return object.offer.features.includes(checkboxFilter);
    },

    isSatisfySelectFilter: function (selectFilter, object) {

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
    },

    resetActiveFilterFields: function () {
      formFilter.reset();
    }

  };

  formFilter.addEventListener('change', function () {

    window.debounce(function () {
      window.cardsUtils.closePopup();
      window.filterUtils.launchFilter();
    });


  });

})();
