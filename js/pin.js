'use strict';

(function () {

  var ENTER_KEYCODE = 13;

  var mapPins;
  /*  блок куда будем отрисовывать наши pin */
  var containerForPin = document.querySelector('.map__pins');

  window.pinsUtils = {

    determineNumberOutputLabels: function (numberOutputLabels) {

      var maxNumberOutputLabels = 5;
      numberOutputLabels = numberOutputLabels <= maxNumberOutputLabels ? numberOutputLabels : maxNumberOutputLabels;

      return numberOutputLabels;
    },

    preRenderPins: function (template, obj, fragment, id) {

      var pinNode = window.pinsUtils.renderPin(template, obj);
      pinNode.setAttribute('data-objectId', id);
      fragment.appendChild(pinNode);

    },

    /*  выводим все пины перед в блок .map__pins */
    renderPins: function (objectsArray) {

      var objectsFragment = document.createDocumentFragment();
      var mapPinsObjectTemplate = document.querySelector('template').content.querySelector('.map__pin');
      var length = window.pinsUtils.determineNumberOutputLabels(objectsArray.length);

      objectsArray.every(function(objectItem, i, objectsArray) {

        if (i > length - 1) {
          return false;
        }

        var idx = window.data.cardObjectsArray.indexOf(objectItem);
        window.pinsUtils.preRenderPins(mapPinsObjectTemplate, objectItem, objectsFragment, idx);

        return true;

      });

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
      mapPins.forEach(function(mapPinItem, i, mapPins) {
        mapPinItem.classList.remove('map__pin--active');
      });

    },

    processingPin: function processingPin(goal) {

      var pin = goal.closest('button.map__pin');

      if (!pin) {
        return;
      }

      if(pin.classList.contains('map__pin--main')){

        window.pinsUtils.deletePins();
        window.filterUtils.resetActiveFilterFields();
        window.pinsUtils.renderPins(window.data.cardObjectsArray);

      }

      if (!containerForPin.contains(pin)) {
        return;
      }

      window.showCard(pin);

    },

    /* обрабатываем нажатие по пину */
    clickOnPin: function () {

      containerForPin.addEventListener('mouseup', function (evt) {

        var target = evt.target;

        if (target.parentElement.classList.contains('map__pin')) {

          var pin = target;

          window.pinsUtils.processingPin(pin);

        }

      });

    },

    keydownOnPin: function () {

      containerForPin.addEventListener('keydown', function (evt) {

        if (evt.keyCode === ENTER_KEYCODE) {

          var target = event.target;

          if (target.classList.contains('map__pin')) {

            var pin = target;

            window.pinsUtils.processingPin(pin);

          }
        }

      });

    },

    deletePins: function () {

      var needDelete = [];
      var pinsArray = Array.prototype.slice.call(containerForPin.childNodes);
      var ELEMENT_NODE = 1;

      var doublesPinsArray = pinsArray.filter(function(pinItem) {
        if (pinItem.nodeType === ELEMENT_NODE) {
          return pinItem;
        }
      });

      doublesPinsArray.forEach(function(pinItem, i, doublesPinsArray) {
        if (!pinItem.classList.contains('map__pin--main', 'map__pinsoverlay') && pinItem.classList.contains('map__pin')) {
         pinItem.remove();
       }

     });

    },

    makeReclinabileLink: function() {

      var mainPin = document.querySelector('.map__pin--main');

      mainPin.style.cssText = 'pointer-events: none; cursor: default; opacity: 0.5;';

    }

  };

  window.pinsUtils.clickOnPin();
  window.pinsUtils.keydownOnPin();

})();
