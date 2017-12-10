/* global cozy */

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

export const PermissionsList = ({ t, permissions, appName }) => {
  const permissionsArray = Object.values(permissions).map(p => {
    p.typeDescription = t(`doctypes.${p.type}`).replace(/^doctypes\./, '')
    return p
  })
  return permissionsArray.length ? (
    <div>
      <ReactMarkdownWrapper
        source={t('app_modal.install.permissions.description', {
          cozyName: cozy.client._url.replace(/^\/\//, ''),
          appName
        })}
      />
      <ul className='sto-perm-list'>
        {permissionsArray.map(permission => (
          <li key={permission.type} className={permission.type}>
            <ReactMarkdownWrapper
              source={`__${permission.typeDescription}__`}
            />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <ReactMarkdownWrapper
      source={t('app_modal.install.permissions.nothing', {
        cozyName: cozy.client._url.replace(/^\/\//, ''),
        appName
      })}
    />
  )
}

export default translate()(PermissionsList)
