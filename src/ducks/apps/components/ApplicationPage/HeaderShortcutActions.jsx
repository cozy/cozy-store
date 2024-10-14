import cozySmileIcon from 'assets/icons/icon-cozy-smile.svg'
import { buildFileFromPathQuery } from 'ducks/queries'
import React, { useState } from 'react'

import { useClient, useFetchShortcut } from 'cozy-client'
import { move } from 'cozy-client/dist/models/file'
import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const HeaderShortcutActions = ({ app }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const client = useClient()
  const { shortcutInfos } = useFetchShortcut(client, app.id)
  const { showAlert } = useAlert()

  const [isBusy, setBusy] = useState(false)

  const config = flag('store.alternative-source')

  const handleAdd = async () => {
    try {
      setBusy(true)
      // Install can be disabled
      const shortcutCategory = app.categories[0]
      const categoryPath = config.categories[shortcutCategory]
      const fileQuery = buildFileFromPathQuery(categoryPath)
      const categoryDirectory = await client.fetchQueryAndGetFromState(
        fileQuery
      )
      await move(client, app, categoryDirectory.data[0])
      showAlert({
        message: t('HeaderShortcutActions.addSuccess'),
        severity: 'success'
      })
    } catch {
      showAlert({
        message: t('HeaderShortcutActions.error'),
        severity: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async () => {
    try {
      setBusy(true)
      // Uninstall can be disabled
      const storePath = config.store
      const fileQuery = buildFileFromPathQuery(storePath)
      const storeDirectory = await client.fetchQueryAndGetFromState(fileQuery)
      await move(client, app, storeDirectory.data[0])
      showAlert({
        message: t('HeaderShortcutActions.removeSuccess'),
        severity: 'success'
      })
    } catch {
      showAlert({
        message: t('HeaderShortcutActions.error'),
        severity: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const url = shortcutInfos?.data?.attributes?.url || ''

  return (
    <>
      <Button
        href={url}
        label={t('HeaderShortcutActions.open')}
        className="c-btn"
        disabled={isBusy}
      />
      {app.installed ? (
        <Button
          variant="secondary"
          fullWidth={isMobile}
          className={isMobile ? 'u-mt-1' : null}
          onClick={handleRemove}
          label={t('HeaderShortcutActions.remove')}
          busy={isBusy}
        />
      ) : (
        <Button
          variant="secondary"
          fullWidth={isMobile}
          className={isMobile ? 'u-mt-1' : null}
          onClick={handleAdd}
          startIcon={<Icon icon={cozySmileIcon} />}
          label={t('HeaderShortcutActions.add')}
          busy={isBusy}
        />
      )}
    </>
  )
}

export { HeaderShortcutActions }
