/* global cozy */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import Button from 'cozy-ui/react/Button'

import Header from './Header'
import Gallery from './Gallery'
import Details from './Details'
import { getLocalizedAppProperty } from 'ducks/apps'

const MOBILE_PLATFORMS = ['ios', 'android']
const isMobilePlatform = name => MOBILE_PLATFORMS.includes(name)

const { BarCenter } = cozy.bar

export class ApplicationPage extends Component {
  constructor(props) {
    super(props)
    this.state = { displayBarIcon: false }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    if (!this.state.displayBarIcon && window.scrollY > 100) {
      this.setState(() => ({ displayBarIcon: true }))
    } else if (this.state.displayBarIcon && window.scrollY < 100) {
      this.setState(() => ({ displayBarIcon: false }))
    }
  }

  render() {
    const {
      t,
      lang,
      parent,
      app,
      isFetching,
      fetchError,
      breakpoints = {}
    } = this.props
    const { displayBarIcon } = this.state
    const { isMobile } = breakpoints
    if (isFetching) {
      return (
        <div className="sto-app">
          <Spinner size="xxlarge" loadingType="appsFetching" middle />
        </div>
      )
    }
    if (fetchError) {
      return (
        <p className="u-error">
          {t('app_modal.install.message.version_error', {
            message: fetchError.message
          })}
        </p>
      )
    }
    const {
      icon,
      installed,
      maintenance,
      uninstallable,
      related,
      slug,
      type,
      iconToLoad
    } = app
    const appName = getLocalizedAppProperty(app, 'name', lang)
    const namePrefix = getLocalizedAppProperty(app, 'name_prefix', lang)
    const appShortDesc = getLocalizedAppProperty(app, 'short_description', lang)
    const appLongDesc = getLocalizedAppProperty(app, 'long_description', lang)
    const appChanges = getLocalizedAppProperty(app, 'changes', lang)
    const mobileApps =
      app.platforms &&
      !!app.platforms.length &&
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
        {isMobile &&
          icon &&
          !iconToLoad && (
            <BarCenter>
              <div className="sto-app-bar">
                <img
                  className={`sto-app-bar-icon ${
                    !displayBarIcon ? 'sto-app-bar-icon--hidden' : ''
                  }`}
                  src={icon}
                  alt={`${slug}-icon`}
                />
              </div>
            </BarCenter>
          )}
        <div className="sto-app">
          <Button
            icon="back"
            tag={Link}
            to={`${parent}`}
            className="sto-app-back"
            label={t('app_page.back')}
            subtle
          />
          <Header
            icon={icon}
            iconToLoad={iconToLoad}
            namePrefix={namePrefix}
            name={appName}
            type={type}
            description={appShortDesc}
            installed={installed}
            installedAppLink={related}
            uninstallable={uninstallable}
            parent={parent}
            slug={slug}
            maintenance={maintenance}
          />
          {app.screenshots &&
            !!app.screenshots.length && (
              <Gallery slug={slug} images={app.screenshots} />
            )}
          <Details
            app={app}
            description={appLongDesc}
            changes={appChanges}
            mobileApps={mobileApps}
            parent={parent}
          />
        </div>
      </div>
    )
  }
}

// translate is needed here for the lang props
export default translate()(withBreakpoints()(ApplicationPage))
