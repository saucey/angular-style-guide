#### 20-04-2016

Added function to create consistent responsive modal content:
Drupal.aegonModal(action, options, callback);
@param action (string, optional): 'open' (default) (opens the modal if options are passed), 'position' (centers the modal in the screen), 'update' (updates the content of the modal), 'close' (close the modal).
@param options (object): layout and content options for the modal:  
{  
   **title**: '', // @string: title text, no HTML  
   **body**: '', // @string: HTML for the body  
   **close**: true, // @boolean: Add close button  
   **ajax**: false, // @boolean: whether to add the loader or not  
   **ajaxText**: '', // @string: Text to show while waiting for ajax if ajax === true  
   **overlay**: true, // @boolean: dark overlay behind the modal  
   **timeOut**: 0, // @number (miliseconds): the amount of time of wait till show the timeOutMessage if ajax === true  
   **timeOutMessage**: '', // @string: message to show after time out if ajax === true  
   **width**: '' // @int: the width of the modal (it has a max-width of 100% so there won't be scroll).  
}  
@param callback (function)(optional): what to do after the modal is open. This is for ajax content:

```javascript
  /* Sample function for advisor */
  function openAdvModal() {
    var callback = function() {
      jQuery.ajax({
        url: '/file/example/aegon_modal.json',
        dataType: 'json'
      }).done(function(data){
        Drupal.aegonModal('update', data);
      });
    }
    Drupal.aegonModal({ajax: true, timeOut: 3000, timeOutMessage: "Contactgegevens ophalen duurt langer dan verwacht. Probeer het later nog eens."}, callback);
  }
```

#### 29-02-2016

Added classes to show or hide elements depending on the devices breack points:

Class              | Mobile ( < 641px )    | Tablet ( > 640px && < 901px )   | Desktop ( > 900px )
------------------ | :-------------------: | :-----------------------------: | :--------------------:
`.visible-mobile`  | Visible               | Hidden                          | Hidden
`.hidden-mobile`   | Hidden                | Visible                         | Visible
`.visible-tablet`  | Hidden                | Visible                         | Hidden
`.hidden-tablet`   | Visible               | Hidden                          | Visible
`.visible-desktop` | Hidden                | Hidden                          | Visible
`.hidden-desktop`  | Visible               | Visible                         | Hidden