export const template = `
<a class="button arrow" href="#aegon-modal-content" data-aegon="modal" data-modal-body="This is the body" data-modal-close="true" data-modal-width="1000" data-modal-overlayClose="true" data-modal-id="my-custom-id">Click to open the modal</a>
  <div id="aegon-modal-content" hidden>
    <div style="padding-top:20px">
      <div style="width:100%;height:400px;background-color:grey;position:relative">
  		  <iframe allowfullscreen="" frameborder="0" scrolling="no" src="https://www.youtube.com/embed/-5UmN1_RVmU?rel=0&showinfo=0" style="width:100%;height:100%"></iframe>
      </div>
      <table style="width:100%;height: 250px; background-color:yellow">
        <tr>
          <td style="background-color: green;width:33%">
            <img src="https://www.uat.aegon.nl/sites/aegonnl/public_files/afbeeldingen/Icons/Klok_def_donker_70x70.jpg" title="Lange termijn">
          </td>
          <td style="background-color: red;width:33%">
            <img src="https://www.uat.aegon.nl/sites/aegonnl/public_files/afbeeldingen/Icons/Kalender_def-70x70.jpg" title="Periodiek beleggen">
          </td>
          <td style="background-color: blue;width:33%">
            <img src="https://www.uat.aegon.nl/sites/aegonnl/public_files/afbeeldingen/Icons/Monitor_def_70x70.jpg" title="Rendement">
          </td>
        </tr>
      </table>
    </div>
  </div>


`;


/**
 *
  <div id="my-custom-id" class="aegon-modal visible" style="width: 1000px; bottom: auto; overflow-y: visible; max-width: 100vw; margin-left: -480px; top: 48.5px;">
    <ng-content></ng-content>
  </div>
  <a class="icon-uniE60D close-modal" data-close="modal"></a>

      <table style="width:100%;height: 250px; background-color:yellow">
        <tr>
          <td style="background-color: green;width:33%"> Links </td>
          <td style="background-color: red;width:33%"> Midden </td>
          <td style="background-color: blue;width:33%"> Rechts </td>
        </tr>
      </table>
      <div>
        <div>Inner value: {{ test }}</div>
        Ng-content value: <ng-content></ng-content>
      </div>

  */