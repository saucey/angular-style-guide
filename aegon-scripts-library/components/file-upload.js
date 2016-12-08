/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function(Drupal, $) {
  'use strict';

  Drupal.behaviors.fileUpload = {
    attach: function(context) {
      var that = this,
          fileUploads = $('.file-upload .file-upload__input', context);

      if(fileUploads.length) {
        fileUploads.each(function(i, e) {
          that.addEvents(e);
        });
      }
    },
    addEvents: function(ele) {
      var that = this,
          $ele = $(ele),
          inputFile = $ele.find('input[type=file]'),
          multiple = inputFile.prop('multiple') || (inputFile.attr('name').indexOf('[') > -1 && inputFile.attr('name').indexOf(']') > -1),
          fileList = $ele.parent().find('.file-upload__list');

      var imgCallback = function(file){
        // Only if list div exists.
        if(fileList.length) {
          var tmplt = Drupal.behaviors.fileUpload.getFileListItem(file),
              newInput = inputFile.clone(true).removeClass('blurred').val('');
          if(multiple) {
            tmplt.prepend(newInput);
            fileList.append(tmplt);
          } else {
            fileList.html(tmplt);
          }
        }
      };
      // Remove button.
      $(document).on('click', '.file-upload .file-upload__remove', function() {
        console.log('remove button click');
        $(this).parent().remove();
        if(!multiple) {
          inputFile.val('');
        }
      });
      // Input file change.
      inputFile.on('change', function() {
        that.imageHandler.readfiles(this.files, imgCallback);
      });
    },
    getFileListItem: function(file) {
      var tmplt = '<div class="file-upload__input file-upload__input--uploaded">' +
        '<span class="file-upload__name icon-file-thin">{{fileName}}</span> ' +
        ' <a class="icon-x file-upload__remove"></a>' +
        '</div>';

      if(typeof file === 'object' && 'name' in file) {
        tmplt = tmplt.replace('{{fileName}}', file.name);
      }

      return $(tmplt);
    },
    /**
     * For specific file types, this function should be run first,
     * Otherwise the default file types will be used.
     *
     * @param $filesTypes: list of files extension including the dot.
     */
    fileTypes: function($filesTypes) {
      var acceptedTypes = $filesTypes.replace(/\s/g, '');
      acceptedTypes = acceptedTypes.split(',');

      if(acceptedTypes.length) {
        // Each file type should contain the extension
        // prefixed by a dot.
        for(var i=0;i<acceptedTypes.length;i++) {
          if(acceptedTypes[i].indexOf('.') !== 0) {
            acceptedTypes.splice(i, 1);
          }
        }

        this.imageHandler.acceptedTypes = acceptedTypes;
      }
    },
    /**
     * Functions to handle images.
      */
    imageHandler: {
      /*
       * Checks for browser support
       */
      tests: {
        filereader: typeof FileReader !== 'undefined',
        formdata: !!window.FormData,
        progress: "upload" in new XMLHttpRequest()
      },
      /**
       * Array with the accepted file types
       */
      acceptedTypes: [
        '.pdf',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.jpg',
        '.jpeg',
        '.png'
      ],
      /**
       * Reads a file
       *
       * @param files: array with files
       * @param callback: a function to run after the file is read.
       */
      readfiles: function(files, callback) {
        console.log('reading files', this);
        if(files.length > 0){
          // var formData = this.tests.formdata ? new FormData() : null;
          // attach the file to the global variable
          for (var i = 0; i < files.length; i++) {
            this.previewfile(files[i], callback);
          }
        }
      },
      /*
       * Handles a file information
       *
       * @param file: a file object
       * @param callback: the function to run with the file as parameter
       */
      previewfile: function(file, callback) {
        if (this.tests.filereader === true) {

          var reader = new FileReader();
          reader.onload = function () {
            if(typeof callback !== undefined && typeof callback === 'function'){
              callback(file);
            }
          };

          reader.readAsDataURL(file);
        } else {
          // We need to do something if it's not valid file format
          console.log(file);
        }
      }
    },
    attached: false
  };
})(Drupal, jQuery);
