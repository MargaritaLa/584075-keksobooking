'use strict';

(function () {

 var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

 var fileChooser = document.querySelector('#avatar');
 var preview = document.querySelector('.notice__preview img');

 fileChooser.addEventListener('change', function () {
  var file = fileChooser.files[0];
  var fileName = file.name.toLowerCase();

  var matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

})();
