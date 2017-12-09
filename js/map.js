'use strict';

(function () {

  var blockForm = document.querySelector('.notice__form');
  var blockMap = document.querySelector('.map');

  /* стартовый пин */
  var mapMainPin = document.querySelector('.map__pin.map__pin--main');

  /* работа с картой */
  mapMainPin.addEventListener('mouseup', activateFormAndMap);
  /* выводим все пины в  блок .map__pins */
  window.pinsUtils.renderPins(window.data.cardObjectsArray);
  document.addEventListener('keydown', window.cardsUtils.onPopupEscPress);

  // функции обработки событий

  function activateFormAndMap() {
    blockMap.classList.remove('map--faded');
    blockForm.classList.remove('notice__form--disabled');
    window.formUtils.changeStateFieldsForm(false);
  }

})();
