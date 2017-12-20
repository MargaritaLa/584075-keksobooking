'use strict';

(function () {

  var ENTER_KEYCODE = 13;

  var mapPins;
  /*  блок куда будем отрисовывать наши pin */
  var containerForPin = document.querySelector('.map__pins');

  window.dataUtils.onDataLoadedCallback = function (objectsArray) {
    window.pinsUtils.renderPins(objectsArray);
  };

  window.pinsUtils = {

    determineNumberOutputLabels: function(numberOutputLabels){
      var maxNumberOutputLabels = 5;
      return numberOutputLabels <= maxNumberOutputLabels ? numberOutputLabels : numberOutputLabels = maxNumberOutputLabels;

    },

    preRenderPins: function (template, obj, fragment, id){

      var pinNode = window.pinsUtils.renderPin(template, obj);
      pinNode.setAttribute('data-objectId', id);
      fragment.appendChild(pinNode);

    },

    /*  выводим все пины перед в блок .map__pins */
    renderPins: function (objectsArray) {
      var objectsFragment = document.createDocumentFragment();
      var mapPinsObjectTemplate = document.querySelector('template').content.querySelector('.map__pin');
      var length = window.pinsUtils.determineNumberOutputLabels(objectsArray.length);
      for (var i = 0; i <= length - 1; i++) {
        var object = objectsArray[i];
        var idx = window.data.cardObjectsArray.indexOf(object);
        window.pinsUtils.preRenderPins(mapPinsObjectTemplate, object, objectsFragment, idx);
      }

      containerForPin.appendChild(objectsFragment);
      mapPins = document.querySelectorAll('.map__pin');

      return mapPins;
    },

    /*  функция вывода пина в верстку / отрисовка шаблона объекта в документ */
    renderPin: function renderPin(mapPinsObjectTemplate, pin) {

      var pinNode = mapPinsObjectTemplate.cloneNode(true);
      var marginLeft = pinNode.querySelector('img').width / 2;
      var marginTop = pinNode.querySelector('img').height / 2;

      pinNode.querySelector('img').src = pin.author.avatar;
      pinNode.style.left = (pin.location.x - marginLeft) + 'px';
      pinNode.style.top = (pin.location.y - marginTop) + 'px';
      pinNode.setAttribute('tabindex', '0');

      return pinNode;
    },

    /* удаление класса active с пина */
    deleteActiveClass: function deleteActiveClass() {

      /* все пины */
      for (var i = 0; i <= mapPins.length - 1; i++) {
        mapPins[i].classList.remove('map__pin--active');
      }

    },

    processingPin: function processingPin(goal) {

      var pin = goal.closest('button.map__pin');

      if (!pin || pin.classList.contains('map__pin--main')) {
        return;
      }

      if (!containerForPin.contains(pin)) {
        return;
      }
      window.showCard(pin);
    },

    /* обрабатываем нажатие по пину */
    clickOnPin: function () {

      containerForPin.addEventListener('mouseup', function () {

        var target = event.target;

        if (target.parentElement.classList.contains('map__pin')) {

          var pin = target;


          window.pinsUtils.processingPin(pin);

        }

      });

    },

    keydownOnPin: function () {

      containerForPin.addEventListener('keydown', function () {

        if (event.keyCode === ENTER_KEYCODE) {

          var target = event.target;

          if (target.classList.contains('map__pin')) {

            var pin = target;

            window.pinsUtils.processingPin(pin);

          }
        }

      });

    },

    deletePins: function() {

      var needDelete = [];

      for (var i = 0; i < containerForPin.childNodes.length; i++)
      {
    // если тип узла - элемент
    if (containerForPin.childNodes[i].nodeType === 1
      && containerForPin.childNodes[i].nodeType !== 'undefined'
      && !containerForPin.childNodes[i].classList.contains('map__pin--main')
      && !containerForPin.childNodes[i].classList.contains('map__pinsoverlay')
      && containerForPin.childNodes[i].classList.contains('map__pin'))
    {
      needDelete.push(containerForPin.childNodes[i]);
    }
  }

  for(var i = 0; i < needDelete.length; i++) {
    needDelete[i].remove();
  }

}

};

window.pinsUtils.clickOnPin();
window.pinsUtils.keydownOnPin();




})();
