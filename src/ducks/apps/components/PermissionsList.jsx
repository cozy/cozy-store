import React from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'
import { getTranslatedManifestProperty } from 'lib/helpers'

import localAccessIcon from 'assets/icons/icon-cloud-in-cozy.svg'
import externalIcon from 'assets/icons/icon-cloud-out-cozy.svg'

import LINXO_CONNECTORS from 'config/linxo.json'
import PERMISSIONS_ICONS from 'config/permissionsIcons.json'

export const Permission = ({ description, label, type, t }) => {
  const permIconName = PERMISSIONS_ICONS[type] || 'fallback'
  const permIcon = require(`assets/icons/permissions/${permIconName}.svg`)
    .default
  return (
    <li className="sto-perm-list-item">
      <div className="sto-perm-label">
        <span className="sto-perm-title" data-doctype={type}>
          <Icon icon={permIcon} className="sto-perm-title-icon" />
          {label}
        </span>
        {description && (
          <small className="sto-perm-description">
            <ReactMarkdownWrapper
              className="sto-perm-description-detail"
              source={`${t('permissions.reason')}${description}`}
            />
          </small>
        )}
      </div>
    </li>
  )
}

const LocalizedPermission = ({ t, app, name, type }) => (
  <Permission
    description={getTranslatedManifestProperty(
      app,
      `permissions.${name}.description`,
      t
    )}
    label={t(`doctypes.${type}`)}
    type={type}
    t={t}
  />
)

const getProcessedPermissions = (t, app) => {
  const external = [] // external permissions
  const externalTypes = [] // use to filter the internal after processing
  if (LINXO_CONNECTORS.includes(app.slug)) {
    const linxoType = 'io.cozy.accounts'
    external.push(
      <Permission
        description={
          app.partnership && app.partnership.name && app.partnership.domain
            ? t('permissions.banking', {
                name: app.partnership.name,
                domain: app.partnership.domain
              })
            : t('permissions.linxo')
        }
        label={t(`doctypes.${linxoType}`)}
        type={linxoType}
        key={linxoType}
        t={t}
      />
    )
    externalTypes.push(linxoType)
  }

  // internal permissions
  const internal = Object.keys(app.permissions || {})
    .filter(name => !externalTypes.includes(app.permissions[name].type))
    .map(name => (
      <LocalizedPermission
        app={app}
        key={name}
        {...app.permissions[name]}
        name={name}
        t={t}
      />
    ))
  return { internalPermissions: internal, externalPermissions: external }
}

export const PermissionsList = ({ t, app }) => {
  const { externalPermissions, internalPermissions } = getProcessedPermissions(
    t,
    app
  )
  const appName = getTranslatedManifestProperty(app, 'name', t)
  const developerName =
    (app.developer && app.developer.name) || t('permissions.developer_default')
  return app.permissions ? (
    <div>
      {!!externalPermissions.length && (
        <div className="sto-perm-list-title">
          <Icon
            className="sto-perm-list-icon"
            icon={externalIcon}
            size="24"
            color="#FF7F1B"
          />
          <p>
            {t('permissions.description.external', { name: developerName })}
          </p>
        </div>
      )}
      <ul className="sto-perm-list">{externalPermissions}</ul>
      {!!internalPermissions.length && (
        <div className="sto-perm-list-title">
          <Icon
            className="sto-perm-list-icon"
            icon={localAccessIcon}
            size="24"
            color="#35CE68"
          />
          <p>
            {t('permissions.description.internal', { name: developerName })}
          </p>
        </div>
      )}
      <ul className="sto-perm-list">{internalPermissions}</ul>
    </div>
  ) : (
    <ReactMarkdownWrapper
      source={t('permissions.description.nothing', {
        appName
      })}
    />
  )
}

export default translate()(PermissionsList)
