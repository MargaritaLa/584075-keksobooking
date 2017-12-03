'use strict';

(function () {

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

  /*  блок куда будем отрисовывать наши pin */
  var containerForPin = document.querySelector('.map__pins');
  /*  рабочий блок */
  var blockMap = document.querySelector('.map');
  blockMap.classList.remove('map--faded');

  createObjectsArray(cardObjectsCount);

  /* выводим все объекты перед блоком .map__filters-container */
  renderObjects(blockMap, cardObjectsArray);

  /* выводим все пинв в  блок .map__pins */
  renderPins(containerForPin, cardObjectsArray);

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
  function renderObjects(benchmark, cardObjectsResultingArray) {

    /* ссылка на пустой объект */
    var objectsFragment = document.createDocumentFragment();
    /* шаблон в который копируем объект DocumentFragment (явл-ся NODом) */
    var mapPopupObjectTemplate = document.querySelector('template').content.querySelector('article.map__card');

    /* блок перед которым будем вставлять блоки с нашими элементами */
    var lookoutEl = document.querySelector('.map__filters-container');
    for (var i = 0; i <= cardObjectsArray.length - 1; i++) {
      objectsFragment.appendChild(renderObject(mapPopupObjectTemplate, cardObjectsResultingArray[i]));
    }

    benchmark.insertBefore(objectsFragment, lookoutEl);
  }

  /*  функция вывода объекта в верстку / отрисовка шаблона объекта в документ */
  function renderObject(mapPopupObjectTemplate, object) {

    var pinObjectNode = mapPopupObjectTemplate.cloneNode(true);
    pinObjectNode.querySelector('.popup__avatar').src = object.author.avatar;
    pinObjectNode.querySelector('h3').textContent = object.offer.title;
    pinObjectNode.querySelector('p small').textContent = object.offer.address;
    pinObjectNode.querySelector('.popup__price').innerHTML = object.offer.price + ' &#x20bd;/ночь';

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

    /* ссылка на пустой объект */
    var objectsFragment = document.createDocumentFragment();
    var mapPinsObjectTemplate = document.querySelector('template').content.querySelector('.map__pin');

    for (var i = 0; i <= objectsArray.length - 1; i++) {
      objectsFragment.appendChild(renderPin(mapPinsObjectTemplate, objectsArray[i]));
    }

    container.appendChild(objectsFragment);
  }

  /*  функция вывода пина в верстку / отрисовка шаблона объекта в документ */
  function renderPin(mapPinsObjectTemplate, pin) {

    var pinNode = mapPinsObjectTemplate.cloneNode(true);

    var marginLeft = pinNode.querySelector('img').width / 2;
    var marginTop = pinNode.querySelector('img').height / 2;

    pinNode.querySelector('img').src = pin.author.avatar;
    pinNode.style.left = (pin.location.x - marginLeft) + 'px';
    pinNode.style.top = (pin.location.y - marginTop) + 'px';
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

})();
