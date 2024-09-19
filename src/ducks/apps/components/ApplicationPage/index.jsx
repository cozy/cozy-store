import { getAppIconProps } from 'ducks/apps'
import Details from 'ducks/apps/components/ApplicationPage/Details'
import Gallery from 'ducks/apps/components/ApplicationPage/Gallery'
import Header from 'ducks/apps/components/ApplicationPage/Header'
import ApplicationPageLoading from 'ducks/components/ApplicationPageLoading'
import FocusTrap from 'focus-trap-react'
import { useLocationNoUpdates } from 'lib/RouterUtils'
import { getTranslatedManifestProperty } from 'lib/helpers'
import {
  preventBackgroundScroll,
  unpreventBackgroundScroll
} from 'lib/scrollHelpers.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link, useMatch, useParams } from 'react-router-dom'

import { BarCenter } from 'cozy-bar'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Left from 'cozy-ui/transpiled/react/Icons/Left'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

const MOBILE_PLATFORMS = ['ios', 'android']
const isMobilePlatform = name => MOBILE_PLATFORMS.includes(name)
const intentStyle = { marginTop: '1.5rem' }

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
      search,
      params,
      isFetching,
      fetchError,
      breakpoints,
      pauseFocusTrap,
      getApp,
      redirectTo,
      intentData
    } = this.props

    if (isFetching) return <ApplicationPageLoading />
    const app = getApp(params)
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

    const styleProp = {
      ...(intentData && { style: { height: '100vh' } })
    }

    return (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
          clickOutsideDeactivates: true
        }}
        paused={pauseFocusTrap}
      >
        <div className="sto-modal-page-app" {...styleProp}>
          {isMobile && icon && !iconToLoad && !intentData && (
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
          <div className="sto-app" style={intentData ? intentStyle : undefined}>
            {!intentData?.data?.slug && (
              <Button
                icon={Left}
                tag={Link}
                to={`/${parent}${search}`}
                className="sto-app-back"
                label={t('app_page.back')}
                onClick={this.unmountTrap}
                subtle
              />
            )}
            <Header
              app={app}
              namePrefix={namePrefix}
              name={appName}
              description={appShortDesc}
              parent={parent}
              intentData={intentData}
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

const ApplicationPageWrapper = props => {
  const { parent } = props
  const params = useParams()
  const { search } = useLocationNoUpdates()
  const isExact = useMatch(`${parent}/:appSlug`)

  return (
    <ApplicationPage
      {...props}
      params={params}
      search={search}
      pauseFocusTrap={!isExact}
    />
  )
}

ApplicationPageWrapper.propTypes = {
  getApp: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  mainPageRef: PropTypes.object.isRequired,
  parent: PropTypes.string.isRequired,
  redirectTo: PropTypes.func.isRequired,
  intentData: PropTypes.shape({
    appData: PropTypes.object,
    data: PropTypes.object
  }),
  /* With HOC */
  breakpoints: PropTypes.object.isRequired,
  f: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}

// translate is needed here for the lang props
export default translate()(withBreakpoints()(ApplicationPageWrapper))
