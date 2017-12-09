'use strict';

(function () {

  // математические функции
  window.utils = {
    /*  функция перемешивания значений в массиве */
    shuffleArray: function shuffleArray(array) {
      return array.sort(function () {
        return Math.random() - 0.5;
      });
    },

    /*  получить случайное число в диапозоне от min до max включительно */
    getRandomValue: function getRandomValue(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /*  получить массив случайных и неповторяющихся чисел */
    getRandomNonRepeatingValue: function getRandomNonRepeatingValue(firstNumber, lastNumber) {
      var nonRepeatingValuesArray = [];
      for (var i = firstNumber; i <= lastNumber; i++) {
        nonRepeatingValuesArray.push(i);
      }
      return window.utils.shuffleArray(nonRepeatingValuesArray);
    },

    /* получение массива что есть в объекте wifi, parking и пр. */
    getObjectFeatures: function getObjectFeatures(allFeatures) {
      var objectFeatures = [];
      allFeatures = window.utils.shuffleArray(allFeatures);
      for (var i = 0; i < window.utils.getRandomValue(0, allFeatures.length); i++) {
        objectFeatures.push(allFeatures[i]);
      }
      return objectFeatures;
    }
  };

})();
