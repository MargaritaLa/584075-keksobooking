'use strict';

(function () {

  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  var createRequest = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          successHandler(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }

    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 1000;

    return xhr;
  };

  window.backend = {

    load: function (successHandler, errorHandler) {
      var xhr = createRequest(successHandler, errorHandler);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },

    save: function (data, successHandler, errorHandler) {
      var xhr = createRequest(successHandler, errorHandler);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }

  };
})();
