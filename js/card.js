'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.cardsUtils = {

    /*  выводим все объекты перед блоком .map__filters-container */
    renderFirstObject: function renderFirstObject(parentContainer, cardObjectsResultingArray, number) {

      var objectFragment = document.createDocumentFragment();
      var mapPopupObjectTemplate = document.querySelector('template').content.querySelector('article.map__card');

      /* блок перед которым будем вставлять блоки с нашими элементами */
      var lookoutEl = document.querySelector('.map__filters-container');
      objectFragment.appendChild(window.cardsUtils.renderObject(mapPopupObjectTemplate, cardObjectsResultingArray[number]));

      parentContainer.insertBefore(objectFragment, lookoutEl);
    },

    /*  функция вывода объекта в верстку / отрисовка шаблона объекта в документ */
    renderObject: function renderObject(mapPopupObjectTemplate, object) {

      var pinObjectNode = mapPopupObjectTemplate.cloneNode(true);
      var popupClose = pinObjectNode.querySelector('.popup__close');

      pinObjectNode.querySelector('.popup__avatar').src = object.author.avatar;
      pinObjectNode.querySelector('h3').textContent = object.offer.title;
      pinObjectNode.querySelector('p small').textContent = object.offer.address;
      pinObjectNode.querySelector('.popup__price').textContent = object.offer.price + ' &#x20bd;/ночь';
      popupClose.setAttribute('tabindex', '0');

      popupClose.addEventListener('click', window.cardsUtils.closePopup);

      popupClose.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.cardsUtils.closePopup();
        }
      });

      var typeName = '';

      if (object.offer.type === 'flat') {
        typeName = 'Квартира';
      }
      if (object.offer.type === 'bungalo') {
        typeName = 'Бунгало';
      }
      if (object.offer.type === 'house') {
        typeName = 'Дом';
      }

      pinObjectNode.querySelector('h4').textContent = typeName;
      pinObjectNode.querySelector('.capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
      pinObjectNode.querySelector('.stay__time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
      pinObjectNode.querySelector('.description').textContent = object.offer.description;

      /*  удаление дочерних элементов */
      var el = pinObjectNode.querySelector('.popup__features');
      while (el.lastChild) {
        el.removeChild(el.lastChild);
      }

      var featuresArray = object.offer.features;

      featuresArray.forEach(function (featureItem) {
        var featureId = featureItem;
        var elListFeatures = document.createElement('li');
        elListFeatures.classList.add('feature', 'feature--' + featureId);
        pinObjectNode.querySelector('.popup__features').appendChild(elListFeatures);
      });

      return pinObjectNode;

    },

    /* закрытие окна */
    onPopupEscPress: function onPopupEscPress(evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.cardsUtils.closePopup();
      }
    },

    closePopup: function closePopup() {
      window.cardsUtils.deleteCardObject();
      window.pinsUtils.deleteActiveClass();
    },

    deleteCardObject: function deleteCardObject() {
      var destroyed = document.querySelector('.map__card');
      if (destroyed) {
        destroyed.remove();
      }
    },

  };

})();
