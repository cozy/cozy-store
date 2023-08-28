import { isFlagshipApp } from 'cozy-device-helper'

export const redirectToConfigure = async ({
  intentData,
  compose,
  app,
  parent,
  redirectTo,
  onTerminate
}) => {
  const { data } = intentData || {}
  const enableConfiguration =
    data && (typeof data.configure === 'undefined' || data.configure)

  const appPath = `/${parent}/${app?.slug || ''}`
  const configurePath = `${appPath}/configure`

  const redirectToApp = () => redirectTo(appPath)

  if (intentData) {
    if (enableConfiguration) {
      /*
        Within an Intent, we cannot use the `/configure` route, because it ultimately returns the `IntentIframe` component which creates a new `iframe` inside the first one.
        This results in a `CSP:frame-ancestors` problem
        It is therefore necessary to favor the use of the `compose` service of `cozy-inter-app` which will add the new `iframe` next to the first
      */
      await compose(
        'CREATE',
        'io.cozy.accounts',
        { slug: app.slug }
      )
    } else {
      onTerminate(app)
    }
    return
  }

  if (isFlagshipApp()) {
    redirectToApp()
  } else {
    redirectTo(configurePath)
  }
}
