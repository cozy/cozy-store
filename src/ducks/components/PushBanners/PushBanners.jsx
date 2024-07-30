import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { makePushBanner } from './helpers'

const PushBanners = ({ oAuthClients, setting }) => {
  const { hash, pathname, search } = useLocation()
  const path = hash + pathname + search
  const prevPath = useRef(path)
  const [hasDismissedFlagshipAppBanner, setHasDismissedFlagshipAppBanner] =
    useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const PushBanner = makePushBanner(oAuthClients, setting)

  // We don't want to display the pass banner immediately
  // after dismissed the FlagshipApp banner, but only after a url change.
  useEffect(() => {
    if (hasDismissedFlagshipAppBanner) {
      if (path === prevPath.current) {
        setShowBanner(false)
      } else {
        setShowBanner(true)
      }
    }

    prevPath.current = path
  }, [hasDismissedFlagshipAppBanner, path])

  if (showBanner && PushBanner) {
    return (
      <PushBanner
        setting={setting}
        setHasDismissedFlagshipAppBanner={setHasDismissedFlagshipAppBanner}
      />
    )
  }

  return null
}

PushBanners.defaultProps = {
  setting: {}
}

export default PushBanners
