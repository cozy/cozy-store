import React from 'react'

import { translate } from 'cozy-ui/react/I18n'

import Header from './Header'
import Gallery from './Gallery'
import Details from './Details'
import { getLocalizedAppProperty } from 'ducks/apps'

export const ApplicationPage = ({t, lang, app, parent}) => {
  const { icon, installed, editor, related, slug } = app
  const appName = getLocalizedAppProperty(app, 'name', lang)
  const appShortDesc = getLocalizedAppProperty(app, 'short_description', lang)
  const appLongDesc = getLocalizedAppProperty(app, 'long_description', lang)
  const appChanges = getLocalizedAppProperty(app, 'changes', lang)
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
      />
    </div>
  )
}

export default translate()(ApplicationPage)
