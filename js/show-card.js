'use strict';

(function () {

  var blockMap = document.querySelector('.map');

  window.showCard = function (pin) {
    if (!pin.classList.contains('map__pin--main')) {
      window.pinsUtils.deleteActiveClass();
      pin.classList.add('map__pin--active');
      window.cardsUtils.deleteCardObject();
      var indexObject = pin.getAttribute('data-objectid');
      window.cardsUtils.renderFirstObject(blockMap, window.data.cardObjectsArray, indexObject);
    }
  };

})();
