import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import Icon from 'cozy-ui/react/Icon'
import localAccessIcon from 'assets/icons/icon-cloud-in-cozy.svg'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

const tOrNothing = (t, key, options) => {
  const translated = t(key, options)
  return translated === key ? '' : translated
}

export const Permission = ({ description, label, type }) => (
  <li key={type} data-doctype={type} className="sto-perm-list-item">
    <div className="sto-perm-label">
      <span className="sto-perm-title">{label}</span>
      <small className="sto-perm-description">{description}</small>
    </div>
  </li>
)

const LocalizedPermission = ({ app, name, t, type }) => (
  <Permission
    description={tOrNothing(t, `${app.slug}.permissions.${name}.description`)}
    label={t(`doctypes.${type}`)}
    type={type}
  />
)

export const PermissionsList = ({ t, app }) => {
  return app.permissions ? (
    <div>
      <h3 className="sto-perm-list-title">
        <Icon className="coz-inline-icon" icon={localAccessIcon} size="24" />
        {t(`permissions.local.description`)}
      </h3>
      <ul className="sto-perm-list">
        {Object.keys(app.permissions).map(name => (
          <LocalizedPermission
            key={name}
            {...app.permissions[name]}
            app={app}
            name={name}
            t={t}
          />
        ))}
      </ul>
    </div>
  ) : (
    <ReactMarkdownWrapper
      source={t('app_modal.install.permissions.nothing', {
        appName: app.name
      })}
    />
  )
}

export default translate()(PermissionsList)
