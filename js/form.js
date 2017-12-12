'use strict';

(function () {

  /* работа с переменными для формы отправки */

  /* блок формы */
  var CAPACITY_NUMBER = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var PRICE = {
    'flat': 1000,
    'bungalo': 0,
    'house': 5000,
    'palace': 10000
  };

  var blockForm = document.querySelector('.notice__form');
  window.addressField = blockForm.querySelector('#address');
  var titleField = blockForm.querySelector('#title');
  var priceField = blockForm.querySelector('#price');
  var timeinField = blockForm.querySelector('#timein');
  var timeoutField = blockForm.querySelector('#timeout');
  var typeFields = blockForm.querySelector('#type');
  var capacityFields = blockForm.querySelector('#capacity');

  var minPrice = 0;
  var maxPrice = 1000000;

  window.formUtils = {
    /* дизаблим поля фильтра и формы*/
    changeStateFieldsForm: function changeStateFieldsForm(flag) {
      var matches = document.querySelectorAll('.map__filters select, .map__filters input, .form__element input, .form__element select, .form__element textarea ');
      for (var i = 0; i < matches.length; i++) {
        matches[i].disabled = flag;
      }
    }
  };

  blockForm.classList.add('notice__form--disabled');

  /* дизаблим все поля формы */
  window.formUtils.changeStateFieldsForm(true);

  /* работа с формой отправки */

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
    if (typeFields.value === 'flat' && priceField.value < PRICE['flat']) {
      setFieldError(priceField, 'минимальная цена квартиры должна быть не менее ' + PRICE['flat'] + ' рублей');
    } else if (typeFields.value === 'bungalo' && priceField.value < PRICE['bungalo']) {
      setFieldError(priceField, 'минимальная цена лачуги должна быть не менее ' + PRICE['bungalo'] + '  рублей');
    } else if (typeFields.value === 'house' && priceField.value < PRICE['house']) {
      setFieldError(priceField, 'минимальная цена дома должна быть не менее ' + PRICE['house'] + ' рублей');
    } else if (typeFields.value === 'palace' && priceField.value < PRICE['palace']) {
      setFieldError(priceField, 'минимальная цена дворца должна быть не менее ' + PRICE['palace'] + ' рублей');
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
          getMinPriceForObjectType(target.value, PRICE);
          break;
        case 'rooms':
          syncChoiceRoomsAndCapacity(target.value, CAPACITY_NUMBER);
          break;
      }
    }
  });

  function getMinPriceForObjectType(key, objectElement) {
    minPrice = objectElement[key];
  }


  function syncChoiceRoomsAndCapacity(key, objectElement) {
    var arrayKeyValues = objectElement[key];
    capacityFields.value = objectElement[key] [window.utils.getRandomValue(0, arrayKeyValues.length - 1)];
  }

})();
