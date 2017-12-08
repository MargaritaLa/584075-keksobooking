'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var imageStartRange = 1;
  var imageEndRange = 8;
  var cardObjectsCount = 8;

  var objectNames = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var objectTypes = ['flat', 'house', 'bungalo'];
  var objectCheckinTimes = ['12:00', '13:00', '14:00'];
  var objectCheckoutTimes = ['12:00', '13:00', '14:00'];
  var objectAllFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var objectPhotos = [];
  var cardObjectsArray = [];
  var mapPins;

  /*  блок куда будем отрисовывать наши pin */
  var containerForPin = document.querySelector('.map__pins');
  /*  рабочий блок */
  var blockMap = document.querySelector('.map');
  /* блок формы */
  var blockForm = document.querySelector('.notice__form');
  /* стартовый пин */
  var mapMainPin = document.querySelector('.map__pin.map__pin--main');


  blockForm.classList.add('notice__form--disabled');

  /* дизаблим все поля формы */
  changeStateFieldsForm(true);

  mapMainPin.addEventListener('mouseup', activateFormAndMap);

  createObjectsArray(cardObjectsCount);

  /* выводим все пинв в  блок .map__pins */
  renderPins(containerForPin, cardObjectsArray);

  /* обрабатываем нажатие по пину */
  containerForPin.addEventListener('mouseup', function () {
    var target = event.target;
    if (target.parentElement.classList.contains('map__pin')) {
      var pin = target;
      processingPin(pin);
    }

  });

  containerForPin.addEventListener('keydown', function () {
    if (event.keyCode === ENTER_KEYCODE) {
      var target = event.target;
      if (target.classList.contains('map__pin')) {
        var pin = target;
        processingPin(pin);
      }
    }
  });

  document.addEventListener('keydown', onPopupEscPress);

  /* создаем массив объектов "Объявление" */
  function createObjectsArray(cardsCount) {

    var imageObjectNumbers = getRandomNonRepeatingValue(imageStartRange, imageEndRange);

    objectNames = shuffleArray(objectNames);
    objectTypes = shuffleArray(objectTypes);

    for (var i = 0; i < cardsCount; i++) {

      var objectLocationX = getRandomValue(300, 900);
      var objectLocationY = getRandomValue(100, 500);

      var cardObject = {
        author: {
          avatar: 'img/avatars/user0' + imageObjectNumbers[i] + '.png'
        },
        offer: {
          title: objectNames[i],
          address: objectLocationX + ', ' + objectLocationY,
          price: getRandomValue(1000, 1000000),
          type: objectTypes[getRandomValue(0, objectTypes.length - 1)],
          rooms: getRandomValue(1, 5),
          guests: getRandomValue(1, 1000),
          checkin: objectCheckinTimes[getRandomValue(0, objectCheckinTimes.length - 1)],
          checkout: objectCheckoutTimes[getRandomValue(0, objectCheckoutTimes.length - 1)],
          features: getObjectFeatures(objectAllFeatures),
          description: '',
          photos: objectPhotos
        },
        location: {
          x: objectLocationX,
          y: objectLocationY
        }
      };

      cardObjectsArray.push(cardObject);
    }

    return cardObjectsArray;
  }

  /*  выводим все объекты перед блоком .map__filters-container */
  function renderFirstObject(parentContainer, cardObjectsResultingArray, number) {

    var objectFragment = document.createDocumentFragment();
    var mapPopupObjectTemplate = document.querySelector('template').content.querySelector('article.map__card');

    /* блок перед которым будем вставлять блоки с нашими элементами */
    var lookoutEl = document.querySelector('.map__filters-container');
    objectFragment.appendChild(renderObject(mapPopupObjectTemplate, cardObjectsResultingArray[number]));

    parentContainer.insertBefore(objectFragment, lookoutEl);
  }

  /*  функция вывода объекта в верстку / отрисовка шаблона объекта в документ */
  function renderObject(mapPopupObjectTemplate, object) {

    var pinObjectNode = mapPopupObjectTemplate.cloneNode(true);
    var popupClose = pinObjectNode.querySelector('.popup__close');
    pinObjectNode.querySelector('.popup__avatar').src = object.author.avatar;
    pinObjectNode.querySelector('h3').textContent = object.offer.title;
    pinObjectNode.querySelector('p small').textContent = object.offer.address;
    pinObjectNode.querySelector('.popup__price').innerHTML = object.offer.price + ' &#x20bd;/ночь';
    popupClose.setAttribute('tabindex', '0');

    popupClose.addEventListener('click', closePopup);

    popupClose.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closePopup();
      }
    });

    if (object.offer.type === 'flat') {
      object.offer.type = 'Квартира';
    }
    if (object.offer.type === 'bungalo') {
      object.offer.type = 'Бунгало';
    }
    if (object.offer.type === 'house') {
      object.offer.type = 'Дом';
    }
    pinObjectNode.querySelector('h4').textContent = object.offer.type;
    pinObjectNode.querySelector('.capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    pinObjectNode.querySelector('.stay__time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    pinObjectNode.querySelector('.description').textContent = object.offer.description;

    /*  удаление дочерних элементов */
    var el = pinObjectNode.querySelector('.popup__features');
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }

    for (var i = 0; i < object.offer.features.length; i++) {
      var featureId = object.offer.features[i];
      var elListFeatures = document.createElement('li');
      elListFeatures.classList.add('feature', 'feature--' + featureId);
      pinObjectNode.querySelector('.popup__features').appendChild(elListFeatures);
    }

    return pinObjectNode;

  }

  /*  выводим все пины перед в блок .map__pins */
  function renderPins(container, objectsArray) {
    var objectsFragment = document.createDocumentFragment();
    var mapPinsObjectTemplate = document.querySelector('template').content.querySelector('.map__pin');

    for (var i = 0; i <= objectsArray.length - 1; i++) {
      var pinNode = renderPin(mapPinsObjectTemplate, objectsArray[i]);
      pinNode.setAttribute('data-objectId', i);
      objectsFragment.appendChild(pinNode);
    }

    container.appendChild(objectsFragment);
    return mapPins = document.querySelectorAll('.map__pin');
  }

  /*  функция вывода пина в верстку / отрисовка шаблона объекта в документ */
  function renderPin(mapPinsObjectTemplate, pin) {

    var pinNode = mapPinsObjectTemplate.cloneNode(true);

    var marginLeft = pinNode.querySelector('img').width / 2;
    var marginTop = pinNode.querySelector('img').height / 2;

    pinNode.querySelector('img').src = pin.author.avatar;
    pinNode.style.left = (pin.location.x - marginLeft) + 'px';
    pinNode.style.top = (pin.location.y - marginTop) + 'px';
    pinNode.setAttribute('tabindex', '0');
    return pinNode;

  }

  /*  функция перемешивания значений в массиве */
  function shuffleArray(array) {
    return array.sort(function () {
      return Math.random() - 0.5;
    });
  }

  /*  получить случайное число в диапозоне от min до max включительно */
  function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /*  получить массив случайных и неповторяющихся чисел */
  function getRandomNonRepeatingValue(firstNumber, lastNumber) {

    var nonRepeatingValuesArray = [];

    for (var i = firstNumber; i <= lastNumber; i++) {
      nonRepeatingValuesArray.push(i);
    }

    return shuffleArray(nonRepeatingValuesArray);

  }

  /* получение массива что есть в объекте wifi, parking и пр. */
  function getObjectFeatures(allFeatures) {

    var objectFeatures = [];

    allFeatures = shuffleArray(allFeatures);

    for (var i = 0; i < getRandomValue(0, allFeatures.length); i++) {
      objectFeatures.push(allFeatures[i]);
    }

    return objectFeatures;

  }

  // функции обработки событий


  function processingPin(goal) {

    var pin = goal.closest('button.map__pin');

    if (!pin || pin.classList.contains('map__pin--main')) {
      return;
    }

    if (!containerForPin.contains(pin)) {
      return;
    }

    openPopupCardObject(pin);

  }


  function activateFormAndMap() {

    blockMap.classList.remove('map--faded');
    blockForm.classList.remove('notice__form--disabled');
    changeStateFieldsForm(false);

  }

  function deleteCardObject() {
    var destroyed = document.querySelector('.map__card');
    if (destroyed) {
      destroyed.remove();
    }
  }

  function changeStateFieldsForm(flag) {
    var matches = document.querySelectorAll('.map__filters select, .map__filters input');
    for (var i = 0; i < matches.length; i++) {
      matches[i].disabled = flag;
    }
  }

  function deleteActiveClass() {
    /* все пины */
    //var mapPins = document.querySelectorAll('.map__pin');
    for (var i = 0; i <= mapPins.length - 1; i++) {
      mapPins[i].classList.remove('map__pin--active');
    }
  }

  /* закрытие окна */
  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  }

  function closePopup() {
    deleteCardObject();
    deleteActiveClass();
  }

  /* открытие окна */
  function openPopupCardObject(pin) {
    if (!pin.classList.contains('map__pin--main')) {
      deleteActiveClass();
      pin.classList.add('map__pin--active');
      deleteCardObject();
      var indexObject = pin.getAttribute('data-objectid');
      renderFirstObject(blockMap, cardObjectsArray, indexObject);
    }
  }

})();
