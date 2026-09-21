import React from 'react'

import classes from './index.module.scss'

export const AREAS_WE_SERVE_MAP_SRC = '/images/corespace-areas-we-serve-map.svg'

export const AreasWeServeMapVisual: React.FC = () => {
  return (
    <img
      alt=""
      aria-hidden
      className={classes.mapSvg}
      decoding="async"
      draggable={false}
      src={AREAS_WE_SERVE_MAP_SRC}
    />
  )
}
