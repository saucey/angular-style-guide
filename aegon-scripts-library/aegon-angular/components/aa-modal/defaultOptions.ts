export const defaultOptions = {
  title: '', // Title in header
  width: '1000px', // Width of dialog
  height: 'inherit', // Height of dialog
  actions: false, // Show actions bar (add content with aa-modal-actions element in contentview)
  close: true, // Show close button; if false modal needs to be close manually (background close, etc. don't work either)
  backgroundClose: true, // User can click background to close
  escapeClose: true, // Escape key to close enabled?
  bodyClassOpen: 'aa-modal--open', // Class to add to body element when modal is open
  hideScrollbar: true, // Disable bodyscroll on open
  addScrollMargin: true, // Add margin right to body to compensate missing scrollbar
  closeDuration: 300 // timeout in ms before modal is removed from DOM. Make equal to css animation duration
};
