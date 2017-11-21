import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'

import Header from './Header'
import Gallery from './Gallery'
import Details from './Details'
import { getLocalizedAppProperty } from 'ducks/apps'

const MOBILE_PLATFORMS = ['ios', 'android']
const isMobilePlatform = (name) => MOBILE_PLATFORMS.includes(name)

export class ApplicationPage extends Component {
  constructor (props) {
    super(props)
    if (props.app) props.fetchLastAppVersion(props.app.slug, 'dev')
  }

  render () {
    const { t, lang, parent, isVersionFetching, currentAppVersion, versionError } = this.props
    if (!currentAppVersion) {
      return (
        <div className='sto-app'>
          {isVersionFetching &&
            <Spinner
              size='xxlarge'
              loadingType='appsFetching'
              middle='true'
            />
          }
          {versionError &&
            <p class='coz-error'>{t('app_modal.install.message.version_error', {message: versionError.message})}</p>
          }
        </div>
      )
    }
    const app = currentAppVersion.manifest
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
      <div>
        {!isVersionFetching && currentAppVersion && <div className='sto-app'>
          <Header
            icon={icon}
            editor={editor}
            name={appName}
            description={appShortDesc}
            installed={installed}
            installedAppLink={related}
            parent={parent}
            slug={slug}
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
        </div>}
      </div>
    )
  }
}

// translate is needed here for the lang props
export default translate()(ApplicationPage)
