'use strict';

(function () {

  /* загрузка объектов с сервера */
  var onLoad = function (downloadedObjects) {

    window.data = {
      cardObjectsArray: downloadedObjects
    };

    window.dataUtils.onDataLoadedCallback(downloadedObjects);

  };

  var onError = function (message) {
    var messageDialog = document.createElement('div');
    window.pinsUtils.makeReclinabileLink();
    messageDialog.classList.add('messageError');
    messageDialog.textContent = message;
    document.body.insertAdjacentElement('afterbegin', messageDialog);
  };

  window.backend.load(onLoad, onError);

  window.dataUtils = {
    onDataLoadedCallback: function () { },
  };

})();
