export const template = `
  <div style="border: 30px solid purple">
    <ng-content></ng-content>
  </div>
`;
// <div class="aa-lightbox" [ngClass]="{'aa-lightbox__visible': visible}" style="position:fixed;-webkit-transform: translate3d(0, 0, 0); left:0;top:0;right:0;bottom:0;z-index:10;background-color:rgba(50,50,50,0.7);">
//     <h1>Core lightbox</h1>
//     <div [outerHTML]="contentHtml"></div>
//     <aa-content></aa-content>
//   </div>