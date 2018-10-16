let initialOverflow

// When a foreground element, for example an application page, is shown,
// call this method prevent the background element to be scrolled
export const preventBackgroundScroll = () => {
  initialOverflow = document.body.style.overflow || 'auto'
  document.body.style.overflow = 'hidden'
}

// Disable background scrolling prevention, should be call to invalidate
// a call to preventBackgroundScroll()
export const unpreventBackgroundScroll = () => {
  document.body.style.overflow = initialOverflow || document.body.style.overflow
}
