import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { makePushBanner } from './helpers'

const PushBanners = ({ oAuthClients, setting }) => {
  const { hash, pathname, search } = useLocation()
  const path = hash + pathname + search
  const prevPath = useRef(path)
  const [hasDismissedAABanner, setHasDismissedAABanner] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const PushBanner = makePushBanner(oAuthClients, setting)

  // We don't want to display the pass banner immediately
  // after dismissed the AA banner, but only after a url change.
  useEffect(() => {
    if (hasDismissedAABanner) {
      if (path === prevPath.current) {
        setShowBanner(false)
      } else {
        setShowBanner(true)
      }
    }

    prevPath.current = path
  }, [hasDismissedAABanner, path])

  if (showBanner && PushBanner) {
    return (
      <PushBanner
        setting={setting}
        setHasDismissedAABanner={setHasDismissedAABanner}
      />
    )
  }

  return null
}

PushBanners.defaultProps = {
  setting: {}
}

export default PushBanners
