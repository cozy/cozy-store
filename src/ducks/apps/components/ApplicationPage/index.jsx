/* global cozy */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import Button from 'cozy-ui/react/Button'
import FocusTrap from 'focus-trap-react'
import AppIcon from 'cozy-ui/react/AppIcon'

import ApplicationPageLoading from 'ducks/components/ApplicationPageLoading'
import { getTranslatedManifestProperty } from 'lib/helpers'
import Header from './Header'
import Gallery from './Gallery'
import Details from './Details'

import {
  preventBackgroundScroll,
  unpreventBackgroundScroll
} from 'lib/scrollHelpers.js'
import { getAppIconProps } from 'ducks/apps'

const MOBILE_PLATFORMS = ['ios', 'android']
const isMobilePlatform = name => MOBILE_PLATFORMS.includes(name)

const { BarCenter } = cozy.bar

export class ApplicationPage extends Component {
  constructor(props) {
    super(props)
    this.state = { displayBarIcon: false, activeTrap: true }
  }

  componentDidMount() {
    preventBackgroundScroll()
    const { mainPageRef } = this.props
    if (mainPageRef && mainPageRef.current) {
      mainPageRef.current.addEventListener('scroll', this.handleScroll, {
        passive: true
      })
    }
  }

  componentWillUnmount() {
    unpreventBackgroundScroll()
    const { mainPageRef } = this.props
    if (mainPageRef && mainPageRef.current) {
      mainPageRef.current.removeEventListener('scroll', this.handleScroll)
    }
  }

  mountTrap = () => {
    this.setState({ activeTrap: true })
  }

  unmountTrap = () => {
    this.setState({ activeTrap: false })
  }

  handleScroll = () => {
    if (
      !this.state.displayBarIcon &&
      this.props.mainPageRef.current.scrollTop > 100
    ) {
      this.setState(() => ({ displayBarIcon: true }))
    } else if (
      this.state.displayBarIcon &&
      this.props.mainPageRef.current.scrollTop < 100
    ) {
      this.setState(() => ({ displayBarIcon: false }))
    }
  }

  render() {
    const {
      t,
      parent,
      matchRoute,
      isFetching,
      fetchError,
      breakpoints = {},
      pauseFocusTrap,
      getApp,
      redirectTo
    } = this.props
    if (isFetching) return <ApplicationPageLoading />
    const app = getApp(matchRoute)
    if (!app) return redirectTo(`/${parent}`)

    const { displayBarIcon } = this.state
    const { isMobile } = breakpoints
    if (fetchError) {
      return (
        <p className="u-error">
          {t('app_modal.install.message.version_error', {
            message: fetchError.message
          })}
        </p>
      )
    }
    const { icon, slug, iconToLoad } = app
    const appName = getTranslatedManifestProperty(app, 'name', t)
    const namePrefix = getTranslatedManifestProperty(app, 'name_prefix', t)
    const appShortDesc = getTranslatedManifestProperty(
      app,
      'short_description',
      t
    )
    const appLongDesc = getTranslatedManifestProperty(
      app,
      'long_description',
      t
    )
    const appChanges = getTranslatedManifestProperty(app, 'changes', t)
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
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
          clickOutsideDeactivates: true
        }}
        paused={pauseFocusTrap}
      >
        <div className="sto-modal-page-app">
          {isMobile && icon && !iconToLoad && (
            <BarCenter>
              <div className="sto-app-bar">
                <AppIcon
                  app={app}
                  className={`sto-app-bar-icon ${
                    !displayBarIcon ? 'sto-app-bar-icon--hidden' : ''
                  }`}
                  {...getAppIconProps()}
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
              onClick={this.unmountTrap}
              subtle
            />
            <Header
              app={app}
              namePrefix={namePrefix}
              name={appName}
              description={appShortDesc}
              parent={parent}
            />
            {app.screenshots && !!app.screenshots.length && (
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
      </FocusTrap>
    )
  }
}

// translate is needed here for the lang props
export default translate()(withBreakpoints()(ApplicationPage))
