import React from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

const isValidUrl = (url) => {
  if (!url) return null
  url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/)
}

export const Details = ({t, description, changes, category, langs, mobileApps, developer}) => {
  const langsInfos = langs && langs.map(l => t(`app_langs.${l}`))
  const developerName = developer && developer.name === 'Cozy' ? 'Cozy Cloud Inc.' : developer.name
  return (
    <div className='sto-app-details'>
      <div className='sto-app-descriptions'>
        {description && <div className='sto-app-description'>
          <h3>{t('app_page.description')}</h3>
          <ReactMarkdownWrapper
            source={description}
            parseEmoji
          />
        </div>}
        {changes && <div className='sto-app-changes'>
          <h3>{t('app_page.changes')}</h3>
          <ReactMarkdownWrapper
            source={changes}
            parseEmoji
          />
        </div>}
      </div>
      <div className='sto-app-additional-details'>
        <h3>{t('app_page.infos.title')}</h3>
        <div className='sto-app-info'>
          <div className='sto-app-info-header'>
            {t('app_page.infos.category')}
          </div>
          <div className='sto-app-info-content'>
            {t(`app_categories.${category || 'others'}`)}
          </div>
        </div>
        {langsInfos && <div className='sto-app-info'>
          <div className='sto-app-info-header'>
            {t('app_page.infos.langs')}
          </div>
          <div className='sto-app-info-content'>
            {langsInfos.join(t('app_langs.list_separator'))}
          </div>
        </div>}
        {mobileApps && !!mobileApps.length &&
          <div className='sto-app-info'>
            <div className='sto-app-info-header'>
              {t('app_page.infos.mobile_app')}
            </div>
            <div className='sto-app-info-content sto-app-info-content--mobile-apps'>
              {mobileApps.map(a => {
                const icon = require(`assets/icons/platforms/icon-${a.type}.svg`)
                return (
                  <a
                    className='sto-app-info-content-icon'
                    href={isValidUrl(a.url) ? a.url : null}
                    target='_blank'
                  >
                    <Icon icon={icon.default} width='24px' height='24px' />
                  </a>
                )
              })}
            </div>
          </div>
        }
        <h3>{t('app_page.developer_infos')}</h3>
        {developer &&
          <div className='sto-app-developer-infos'>
            {developerName && <span>{developerName}</span>}
            {isValidUrl(developer.url) && <a href={developer.url} className='sto-app-developer-link' target='_blank'>
              {developer.url}
            </a>}
          </div>
        }
      </div>
    </div>
  )
}

export default translate()(Details)
