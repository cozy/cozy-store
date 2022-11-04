import React from 'react'
import { HashRouter } from 'react-router-dom'
import {
  shouldEnableTracking,
  getTracker
} from 'cozy-ui/transpiled/react/helpers/tracker'

const addPiwik = function(history) {
  if (shouldEnableTracking() && getTracker()) {
    let trackerInstance = getTracker()
    history = trackerInstance.connectToHistory(history)
    // when using a hash history, the initial visit is not tracked by piwik react router
    trackerInstance.track(history.location)
  }
  return history
}

export const PiwikHashRouter = ({ children }) => (
  <HashRouter history={addPiwik(history)}>{children}</HashRouter>
)

export default PiwikHashRouter
