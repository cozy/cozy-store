import localAccessIcon from '@/assets/icons/icon-cloud-in-cozy.svg'
import externalIcon from '@/assets/icons/icon-cloud-out-cozy.svg'
import LINXO_CONNECTORS from '@/config/linxo.json'
import PERMISSIONS_ICONS from '@/config/permissionsIcons.json'
import REMOTE_DOCTYPES from '@/config/remote-doctypes.json'
import ReactMarkdownWrapper from '@/ducks/components/ReactMarkdownWrapper'
import { getTranslatedManifestProperty } from '@/lib/helpers'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

export const Permission = ({ description, label, type, t }) => {
  const permIconName = PERMISSIONS_ICONS[type] || 'fallback'
  const permIcon = require(`@/assets/icons/permissions/${permIconName}.svg`)
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

const getLocalizedPermissions = ({ t, app, permissions }) => {
  return permissions
    .sort(([, permA], [, permB]) =>
      t(`doctypes.${permA.type}`) < t(`doctypes.${permB.type}`) ? -1 : 1
    )
    .map(([name, permission]) => (
      <LocalizedPermission
        app={app}
        key={name}
        {...permission}
        name={name}
        t={t}
      />
    ))
}

const getLinxoPermissions = ({ t, app, linxoDoctypes }) => {
  return linxoDoctypes.map(linxoType => (
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
  ))
}

const getProcessedPermissions = (t, app) => {
  const externalPermissions = Object.entries(
    app.permissions || {}
  ).filter(([, permission]) => REMOTE_DOCTYPES.includes(permission.type))

  const linxoDoctypes = LINXO_CONNECTORS.includes(app.slug)
    ? ['io.cozy.accounts']
    : []

  const internalPermissions = Object.entries(app.permissions || {})
    .filter(([, permission]) => !REMOTE_DOCTYPES.includes(permission.type))
    .filter(([, permission]) => !linxoDoctypes.includes(permission.type))

  return {
    internalPermissions: getLocalizedPermissions({
      t,
      app,
      permissions: internalPermissions
    }),
    externalPermissions: [
      ...getLinxoPermissions({ t, app, linxoDoctypes }),
      ...getLocalizedPermissions({ t, app, permissions: externalPermissions })
    ]
  }
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
            {t(`permissions.description.internal.${app.type}`, {
              name: developerName
            })}
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
