import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

const isValidUrl = url => {
  if (!url) return null
  return url.match(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
  )
}

const isLessButtonNeeded = (text = '') => {
  // Temporary disbable the less behaviour
  return false
  // const screenWidth = window.innerWidth || 0
  // const textNewLinesCount = text.split(/\r\n|\r|\n/).length
  // if (screenWidth <= 768) {
  //   return text.length > 350 || textNewLinesCount > 7
  // } else if (screenWidth <= 1024) {
  //   return text.length > 220 || textNewLinesCount > 7
  // } else if (screenWidth <= 1440) {
  //   return text.length > 350 || textNewLinesCount > 7
  // } else if (screenWidth <= 2400) {
  //   return text.length > 500 || textNewLinesCount > 7
  // } else {
  //   return false
  // }
}

export class Details extends Component {
  constructor(props) {
    super(props)
    const { changes, description } = this.props
    this.state = {
      lessDescription: isLessButtonNeeded(description),
      lessChanges: isLessButtonNeeded(changes)
    }
  }

  toggleDisplayMore(type) {
    this.setState({ [`less${type}`]: false })
  }

  render() {
    const {
      t,
      description,
      changes,
      categories,
      langs,
      mobileApps,
      developer,
      version
    } = this.props
    const { lessDescription, lessChanges } = this.state
    const langsInfos = langs && langs.map(l => t(`app_langs.${l}`))
    const categoriesInfos =
      categories &&
      !!categories.length &&
      categories.map(c => t(`app_categories.${c}`))
    const developerName =
      developer && developer.name === 'Cozy'
        ? 'Cozy Cloud Inc.'
        : developer.name
    const shortVersion = version && version.match(/^(\d+\.\d+\.\d+)-.*$/)
    const displayedVersion =
      (shortVersion && shortVersion.length && shortVersion[1]) || version
    return (
      <div className="sto-app-details">
        <div className="sto-app-descriptions">
          {description && (
            <div className="sto-app-description">
              <h3>{t('app_page.description')}</h3>
              <ReactMarkdownWrapper
                source={description}
                className={lessDescription ? 'sto-app-description--less' : ''}
                parseEmoji
              />
              {lessDescription && (
                <button
                  type="button"
                  className="sto-details-display-more"
                  onClick={() => this.toggleDisplayMore('Description')}
                >
                  {t('app_page.more')}
                </button>
              )}
            </div>
          )}
          {changes && (
            <div className="sto-app-changes">
              <h3>{t('app_page.changes')}</h3>
              <ReactMarkdownWrapper
                source={changes}
                className={lessChanges ? 'sto-app-changes--less' : ''}
                parseEmoji
              />
              {lessChanges && (
                <button
                  type="button"
                  className="sto-details-display-more"
                  onClick={() => this.toggleDisplayMore('Changes')}
                >
                  {t('app_page.more')}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="sto-app-additional-details">
          <h3>{t('app_page.infos.title')}</h3>
          <div className="sto-app-info">
            <div className="sto-app-info-header">
              {t('app_page.infos.categories')}
            </div>
            <div className="sto-app-info-content">
              {categoriesInfos &&
                categoriesInfos.join(t('app_categories.list_separator'))}
            </div>
          </div>
          <div className="sto-app-info">
            <div className="sto-app-info-header">
              {t('app_page.infos.version.title')}
            </div>
            <div className="sto-app-info-content">
              {displayedVersion || t('app_page.infos.version.unknown')}
            </div>
          </div>
          {langsInfos && (
            <div className="sto-app-info">
              <div className="sto-app-info-header">
                {t('app_page.infos.langs')}
              </div>
              <div className="sto-app-info-content">
                {langsInfos.join(t('app_langs.list_separator'))}
              </div>
            </div>
          )}
          {mobileApps &&
            !!mobileApps.length && (
              <div className="sto-app-info">
                <div className="sto-app-info-header">
                  {t('app_page.infos.mobile_app')}
                </div>
                <div className="sto-app-info-content sto-app-info-content--mobile-apps">
                  {mobileApps.map(a => {
                    const icon = require(`assets/icons/platforms/icon-${
                      a.type
                    }.svg`)
                    return (
                      <a
                        className="sto-app-info-content-icon"
                        href={isValidUrl(a.url) ? a.url : null}
                        target="_blank"
                        key={a.type}
                      >
                        <Icon icon={icon.default} width="24px" height="24px" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          {developerName && (
            <div>
              <h3>{t('app_page.developer_infos')}</h3>
              <div className="sto-app-developer-infos">
                <span>{developerName}</span>
                {isValidUrl(developer.url) && (
                  <a
                    href={developer.url}
                    className="sto-app-developer-link"
                    target="_blank"
                  >
                    {developer.url}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default translate()(Details)
