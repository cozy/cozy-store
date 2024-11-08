import React from 'react'

export const Placeholder = ({ width, height, autoMargin, className }) => {
  const widthStyle = Array.isArray(width)
    ? `${Math.random() * (width[1] - width[0]) + width[0]}rem`
    : width
  const style = {
    width: widthStyle,
    height
  }
  if (autoMargin) style.margin = 'auto'
  return (
    <span
      data-testid="placeholder"
      className={
        'sto-sections-placeholder' + (className ? ' ' + className : '')
      }
      style={style}
    />
  )
}

export default Placeholder
