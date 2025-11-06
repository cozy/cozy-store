import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'

import { redirectToConfigure } from '@/ducks/apps/components/ApplicationRouting/helpers'
import InstallModal from '@/ducks/apps/components/InstallModal'

export const InstallRoute = ({
  getApp,
  isFetching,
  parent,
  redirectTo,
  intentData,
  onTerminate
}) => {
  const params = useParams()

  if (isFetching) return null

  const app = getApp(params)
  if (!app) {
    return redirectTo(`/${parent}`)
  }

  const appPath = `/${parent}/${(app && app.slug) || ''}`
  const redirectToApp = () => redirectTo(appPath)

  const handleRedirectToConfigure = async () => {
    redirectToConfigure({
      intentData,
      compose: intentData?.serviceCompose,
      app,
      parent,
      redirectTo,
      onTerminate
    })
  }

  return (
    <InstallModal
      app={app}
      onInstalled={redirectToApp}
      dismissAction={redirectToApp}
      redirectToConfigure={handleRedirectToConfigure}
      redirectToApp={redirectToApp}
      intentData={intentData}
    />
  )
}

InstallRoute.propTypes = {
  getApp: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  parent: PropTypes.string.isRequired,
  redirectTo: PropTypes.func.isRequired,
  intentData: PropTypes.shape({
    appData: PropTypes.object,
    data: PropTypes.object
  }),
  onTerminate: PropTypes.func
}

export default InstallRoute
