'use strict';

(function () {

  var blockForm = document.querySelector('.notice__form');
  var blockMap = document.querySelector('.map');
  var mainPinHandle = document.querySelector('.map__pin--main');
  var containerForPin = document.querySelector('.map__pins');

  /* стартовый пин */
  var mapMainPin = document.querySelector('.map__pin.map__pin--main');

  var lowerLimit = 500;
  var fromTopEdgeIndent = 200;

  /* работа с картой */
  mapMainPin.addEventListener('mouseup', activateFormAndMap);
  document.addEventListener('keydown', window.cardsUtils.onPopupEscPress);

  /* функции обработки событий */
  function activateFormAndMap() {
    blockMap.classList.remove('map--faded');
    blockForm.classList.remove('notice__form--disabled');
    window.formUtils.changeStateFieldsForm(false);
  }

  /* перемещениe pinMain */

  mainPinHandle.addEventListener('mousedown', function (evt) {

    evt.preventDefault();
    
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var coordY = (mainPinHandle.offsetTop - shift.y);
      var coordX = (mainPinHandle.offsetLeft - shift.x);
      var halfWidth = mainPinHandle.clientWidth / 2;
      var halfHeight = Math.floor((mainPinHandle.clientHeight + 22) / 2);

      var coordLeft;
      var coordTop;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (coordX < halfWidth) {
        coordLeft = halfWidth;
      } else if (coordX > containerForPin.clientWidth - halfWidth) {
        coordLeft = containerForPin.clientWidth - halfWidth;
      } else {
        coordLeft = coordX;
      }


      if (coordY > lowerLimit + fromTopEdgeIndent - halfHeight) {
        coordTop = lowerLimit + fromTopEdgeIndent - halfHeight;
      } else if (coordY < fromTopEdgeIndent - halfHeight) {
        coordTop = fromTopEdgeIndent - halfHeight;
      } else {
        coordTop = coordY;
      }


      mainPinHandle.style.left = coordLeft + 'px';
      mainPinHandle.style.top = coordTop + 'px';

      window.addressField.value = 'x: ' + coordLeft + ', y: ' + (coordTop - fromTopEdgeIndent + halfHeight);

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  mainPinHandle.addEventListener('click', function (evt) {
    evt.preventDefault();
  });

})();
