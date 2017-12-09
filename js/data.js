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

  window.data = {
    cardObjectsArray: createObjectsArray(cardObjectsCount)
  };

  /* создаем массив объектов "Объявление" */
  function createObjectsArray(cardsCount) {
    var cardObjectsArray = [];
    var imageObjectNumbers = window.utils.getRandomNonRepeatingValue(imageStartRange, imageEndRange);

    objectNames = window.utils.shuffleArray(objectNames);
    objectTypes = window.utils.shuffleArray(objectTypes);

    for (var i = 0; i < cardsCount; i++) {

      var objectLocationX = window.utils.getRandomValue(300, 900);
      var objectLocationY = window.utils.getRandomValue(100, 500);

      var cardObject = {
        author: {
          avatar: 'img/avatars/user0' + imageObjectNumbers[i] + '.png'
        },
        offer: {
          title: objectNames[i],
          address: objectLocationX + ', ' + objectLocationY,
          price: window.utils.getRandomValue(1000, 1000000),
          type: objectTypes[window.utils.getRandomValue(0, objectTypes.length - 1)],
          rooms: window.utils.getRandomValue(1, 5),
          guests: window.utils.getRandomValue(1, 1000),
          checkin: objectCheckinTimes[window.utils.getRandomValue(0, objectCheckinTimes.length - 1)],
          checkout: objectCheckoutTimes[window.utils.getRandomValue(0, objectCheckoutTimes.length - 1)],
          features: window.utils.getObjectFeatures(objectAllFeatures),
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

})();
