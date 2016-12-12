/**
 * File Upload plugin
 * Using Drupal API.
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
      // Change the value of the attached key.
      this.attached = true;
    },
    addEvents: function(ele) {
      var that = this,
          $ele = $(ele),
          inputFile = $ele.find('input[type=file]');
      var multiple = inputFile.length && (inputFile.prop('multiple') || (inputFile.attr('name').indexOf('[') > -1 && inputFile.attr('name').indexOf(']') > -1)),
          fileList = $ele.parent().find('.file-upload__list'),
          index = 0;
      // Callback for success.
      var imgCB = function(file) {
        // Only if list div exists.
        if (fileList.length) {
          var tmplt = Drupal.behaviors.fileUpload.getFileListTemplate(file),
            currInput = $ele.find('input[type=file]'),
            inputID = currInput.attr('id') || 'file-upload',
            newInput = currInput.clone(true).removeClass('focus');

          tmplt.prepend(currInput);
          $ele.append(newInput);
          if (multiple) {
            newInput.attr('id', inputID + '-' + index);
            fileList.append(tmplt);
            index++;
          } else {
            fileList.html(tmplt);
          }
        }
      };
      // Callback for error.
      var imgCBErr = function(file) {
        // Only if list div exists.
        if(fileList.length) {
          var tmplt = $ele.parent().find('.file-upload__input--invalid-template');
          tmplt = tmplt.length ? tmplt.clone(true) : Drupal.behaviors.fileUpload.getFileListTemplate(file, 'invalid');
          tmplt = tmplt.removeClass('file-upload__input--invalid-template hidden').addClass('file-upload__input--invalid');
          if (multiple) {
            fileList.append(tmplt);
          }
          else {
            fileList.html(tmplt);
          }
        }
      };
      // Remove button.
      $(document).on('click', '.file-upload .file-upload__remove', function() {
        $(this).parent().remove();
        if(!multiple) {
          inputFile.val('');
        }
      });
      // Input file change.
      inputFile.on('change', function() {
        that.imageHandler.readfiles(this, imgCB, imgCBErr);
      });
    },
    /**
     * Returns a template of the file name to add to list.
     *
     * @param file {object}: A file object
     * @param type {string}: Optional- if invalid template
     * @returns {*|HTMLElement}
     */
    getFileListTemplate: function(file, type) {
      var tmplt;

      switch (type) {
        case 'invalid':
          tmplt = '<div class="file-upload__input file-upload__input--uploaded file-upload__input--invalid">' +
            '<span class="file-upload__name icon-file-corrupted-thin">{{fileName}}</span> ' +
            '</div>';
          break;
        default:
          tmplt = '<div class="file-upload__input file-upload__input--uploaded">' +
            '<span class="file-upload__name icon-file-thin">{{fileName}}</span> ' +
            ' <a class="icon-x file-upload__remove"></a>' +
            '</div>';
      }

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
      if($filesTypes === 'default') {
        this.imageHandler.acceptedTypes = this.imageHandler.defaultTypes;
      }
      else {
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
      }
    },
    /**
     * Functions to handle images.
     */
    imageHandler: {
      /**
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
      acceptedTypes: [],
      /**
       * Array with the default accepted types.
       */
      defaultTypes: [
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
      readfiles: function(input, callback, callbackErr) {
        $(input).addClass('file-upload__input--uploading');
        // Validates accept value.
        if($(input).attr('accept') && $(input).attr('accept') !== '') {
          Drupal.behaviors.fileUpload.fileTypes($(input).attr('accept'));
        }
        else {
          Drupal.behaviors.fileUpload.fileTypes('default');
        }
        // Check support for fileReader API.
        if (this.tests.filereader === true) {
          if(input.files.length > 0){
            var files = input.files;
            // var formData = this.tests.formdata ? new FormData() : null;
            // attach the file to the global variable
            for (var i = 0; i < files.length; i++) {
              var name = files[i].name;
              if(this.isValidType(name)) {
                if(typeof callback === 'function') {
                  this.previewfile(files[i], callback);
                }
              }
              else {
                if(typeof callbackErr === 'function') {
                  this.previewfile(files[i], callbackErr);
                }
              }
            }
          }
        }
        // For IE9
        else{
          if(input.value !== '') {
            var fkFile = {};
            var fileName = input.value;
            fkFile.name = fileName.replace(/C:\\fakepath\\/i, '');
            if(this.isValidType(fileName)) {
              if(typeof callbackErr === 'function') {
                callbackErr(fkFile);
              }
            }
            else {
              if(typeof callback === 'function') {
                callback(fkFile);
              }
            }
          }
        }
        $(input).removeClass('file-upload__input--uploading');
      },
      /**
       * Checks if a file type is valid
       *
       * @param fileName: the complete file name
       * @returns {boolean}
       */
      isValidType: function(fileName) {
        var fileExt = fileName.substring(fileName.lastIndexOf('.'), fileName.length);

        return this.acceptedTypes.indexOf(fileExt) > -1;
      },
      /**
       * Handles a file information
       *
       * @param file: a file object
       * @param callback: the function to run with the file as parameter
       */
      previewfile: function(file, callback) {
        var reader = new FileReader();
        reader.onload = function () {
          if(typeof callback !== undefined && typeof callback === 'function'){
            callback(file);
          }
        };

        reader.readAsDataURL(file);
      }
    },
    attached: false
  };
})(Drupal, jQuery);
