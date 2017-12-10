'use strict';

(function () {

  /* работа с переменными для формы отправки */

  /* блок формы */
  var blockForm = document.querySelector('.notice__form');
  window.addressField = blockForm.querySelector('#address');
  var titleField = blockForm.querySelector('#title');
  var priceField = blockForm.querySelector('#price');
  var timeinField = blockForm.querySelector('#timein');
  var timeoutField = blockForm.querySelector('#timeout');
  var typeFields = blockForm.querySelector('#type');
  var capacityFields = blockForm.querySelector('#capacity');
  var roomsFields = blockForm.querySelector('#room_number');
  var minPrice = 0;
  var maxPrice = 1000000;
  var flatMinPrice = 1000;
  var bungaloMinPrice = 0;
  var houseMinPrice = 5000;
  var palaceMinPrice = 10000;

  window.formUtils = {
    /* дизаблим поля фильтра*/
    changeStateFieldsForm: function changeStateFieldsForm(flag) {
      var matches = document.querySelectorAll('.map__filters select, .map__filters input');
      for (var i = 0; i < matches.length; i++) {
        matches[i].disabled = flag;
      }
    }
  };

  blockForm.classList.add('notice__form--disabled');

  /* дизаблим все поля формы */
  window.formUtils.changeStateFieldsForm(true);

  /* работа с формой отправки */

  getMinPriceForObjectType(typeFields.value);
  syncChoiceRoomsAndCapacity(roomsFields.value, capacityFields);

  titleField.addEventListener('invalid', function () {
    if (titleField.validity.tooShort) {
      setFieldError(titleField, 'Имя должно состоять минимум из 30 символов');
    } else if (titleField.validity.tooLong) {
      setFieldError(titleField, 'Имя не должно превышать 100 символов');
    } else if (titleField.validity.valueMissing) {
      setFieldError(titleField, 'Обязательное поле');
    } else {
      titleField.setCustomValidity('');
    }
  });

  /* валидация поля ЦЕНА */
  priceField.addEventListener('input', function (evt) {
    var target = evt.target;
    syncChoiceTypeAndPrice(target);
  });

  function syncChoiceTypeAndPrice() {
    if (typeFields.value === 'flat' && priceField.value < flatMinPrice) {
      setFieldError(priceField, 'минимальная цена квартиры должна быть не менее ' + flatMinPrice + ' рублей');
    } else if (typeFields.value === 'bungalo' && priceField.value < bungaloMinPrice) {
      setFieldError(priceField, 'минимальная цена лачуги должна быть не менее ' + bungaloMinPrice + '  рублей');
    } else if (typeFields.value === 'house' && priceField.value < houseMinPrice) {
      setFieldError(priceField, 'минимальная цена домы должна быть не менее ' + houseMinPrice + ' рублей');
    } else if (typeFields.value === 'palace' && priceField.value < palaceMinPrice) {
      setFieldError(priceField, 'минимальная цена домы должна быть не менее ' + palaceMinPrice + ' рублей');
    } else if (priceField.value > maxPrice) {
      setFieldError(priceField, 'стоимость не может быть больше ' + maxPrice + ' рублей');
    } else if (priceField.value < minPrice) {
      setFieldError(priceField, 'стоимость не может быть меньше ' + minPrice + ' рублей');
    } else {
      priceField.setCustomValidity('');
    }

  }

  function setFieldError(targetField, errorMsg) {
    targetField.setCustomValidity(errorMsg);
    targetField.classList.add('error');
  }

  /* синхронизация работы полей времени заезда-выезда  */
  blockForm.addEventListener('change', function () {

    var target = event.target;

    if (target.tagName === 'SELECT') {

      var nameSelect = target.getAttribute('name');

      switch (nameSelect) {
        case 'timein':
        timeoutField.value = target.value;
        break;
        case 'timeout':
        timeinField.value = target.value;
        break;
        case 'type':
        getMinPriceForObjectType(target.value);
        syncChoiceTypeAndPrice(target);
        break;
        case 'rooms':
        syncChoiceRoomsAndCapacity(target.value);
        break;
      }
    }
  });

  function syncChoiceRoomsAndCapacity(countRooms) {
    switch (countRooms) {
      case '1':
      capacityFields.value = 1;
      break;
      case '2':
      capacityFields.value = 2;
      break;
      case '3':
      capacityFields.value = 3;
      break;
      case '100':
      capacityFields.value = 0;
      break;
    }
  }

  function getMinPriceForObjectType(objectType) {
    switch (objectType) {
      case 'bungalo':
      minPrice = bungaloMinPrice;
      break;
      case 'flat':
      minPrice = flatMinPrice;
      break;
      case 'house':
      minPrice = houseMinPrice;
      break;
      case 'palace':
      minPrice = palaceMinPrice;
      break;
    }
  }


})();
