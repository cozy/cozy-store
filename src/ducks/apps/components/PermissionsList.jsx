import React from 'react'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

import localAccessIcon from 'assets/icons/icon-cloud-in-cozy.svg'
import externalIcon from 'assets/icons/icon-cloud-out-cozy.svg'

import LINXO_CONNECTORS from 'config/linxo.json'

const tOrNothing = (t, key, options) => {
  const translated = t(key, options)
  return translated === key ? '' : translated
}

export const Permission = ({ description, label, type, t }) => (
  <li key={type} className="sto-perm-list-item">
    <div className="sto-perm-label">
      <span className="sto-perm-title" data-doctype={type}>
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

const LocalizedPermission = ({ slug, name, t, type }) => (
  <Permission
    description={tOrNothing(t, `apps.${slug}.permissions.${name}.description`)}
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
        description={t('permissions.linxo')}
        label={t(`doctypes.${linxoType}`)}
        type={linxoType}
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
        key={name}
        {...app.permissions[name]}
        slug={app.slug}
        name={name}
        t={t}
      />
    ))
  return { internalPermissions: internal, externalPermissions: external }
}

export const PermissionsList = ({ t, app, appName }) => {
  const { externalPermissions, internalPermissions } = getProcessedPermissions(
    t,
    app
  )
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
