import React from 'react'

import { translate } from 'cozy-ui/react/I18n'

import Header from './Header'
import Gallery from './Gallery'
import Details from './Details'
import { getLocalizedAppProperty } from 'ducks/apps'

const MOBILE_PLATFORMS = ['ios', 'android']
const isMobilePlatform = (name) => MOBILE_PLATFORMS.includes(name)

export const ApplicationPage = ({t, lang, app, parent}) => {
  const { icon, installed, editor, related, slug } = app
  const appName = getLocalizedAppProperty(app, 'name', lang)
  const appShortDesc = getLocalizedAppProperty(app, 'short_description', lang)
  const appLongDesc = getLocalizedAppProperty(app, 'long_description', lang)
  const appChanges = getLocalizedAppProperty(app, 'changes', lang)
  const mobileApps = app.platforms && !!app.platforms.length &&
    app.platforms.reduce((mobilePlatforms, platformInfos) => {
      // force to be lower case
      platformInfos.type = platformInfos.type.toLowerCase()
      if (isMobilePlatform(platformInfos.type)) {
        mobilePlatforms.push(platformInfos)
      }
      return mobilePlatforms
    }, [])
  return (
    <div className='sto-app'>
      <Header
        icon={icon}
        editor={editor}
        name={appName}
        description={appShortDesc}
        installed={installed}
        appLink={related}
      />
      <Gallery slug={slug} images={app.screenshots} />
      <Details
        description={appLongDesc}
        changes={appChanges}
        category={app.category}
        langs={app.langs}
        developer={app.developer}
        mobileApps={mobileApps}
      />
    </div>
  )
}

export default translate()(ApplicationPage)
