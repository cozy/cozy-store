/* global cozy */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import Button from 'cozy-ui/react/Button'
import FocusTrap from 'focus-trap-react'

import Header from './Header'
import Gallery from './Gallery'
import Details from './Details'

import {
  preventBackgroundScroll,
  unpreventBackgroundScroll
} from 'lib/scrollHelpers.js'

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
      app,
      isFetching,
      fetchError,
      breakpoints = {},
      pauseFocusTrap
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
    const { icon, slug, iconToLoad } = app
    const appName = t(`apps.${app.slug}.name`, { _: app.name })
    const namePrefix = t(`apps.${app.slug}.name_prefix`, {
      _: app.name_prefix || ''
    })
    const appShortDesc = t(`apps.${app.slug}.short_description`, {
      _: app.short_description || ''
    })
    const appLongDesc = t(`apps.${app.slug}.long_description`, {
      _: app.long_description || ''
    })
    const appChanges = t(`apps.${app.slug}.changes`, { _: '' })
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
              onClick={this.unmountTrap}
              className="sto-app-back"
              label={t('app_page.back')}
              subtle
            />
            <Header
              app={app}
              namePrefix={namePrefix}
              name={appName}
              description={appShortDesc}
              parent={parent}
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
      </FocusTrap>
    )
  }
}

// translate is needed here for the lang props
export default translate()(withBreakpoints()(ApplicationPage))
