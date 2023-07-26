import React, { Children, useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import Intents from 'cozy-interapp'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const CREATING = 'creating'
const CREATED = 'created'
const ERRORED = 'errored'

const IntentHandler = ({ appData, children }) => {
  const [{ error, service, status }, setState] = useState({
    error: null,
    service: null,
    status: CREATING
  })
  const client = useClient()
  const { t } = useI18n()

  useEffect(() => {
    const createService = async () => {
      try {
        const intents = new Intents({ client })
        const service = await intents.createService()
        setState(prev => ({
          ...prev,
          status: CREATED,
          service: service
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error,
          status: ERRORED
        }))
      }
    }
    createService()
  }, [client])

  const intent = service?.getIntent?.()
  const isCreating = status === CREATING
  const child = intent
    ? Children.toArray(children).find(child => {
        const { action, type } = child.props
        return (
          action === intent.attributes.action && type === intent.attributes.type
        )
      })
    : null

  return (
    <div className={`coz-intent${isCreating ? ' --loading' : ''}`}>
      {isCreating && <Spinner size="xxlarge" />}
      {error && (
        <div className="coz-error coz-intent-error">
          <p>{t('intent.service.creation.error.title')}</p>
          <p>{error.message}</p>
        </div>
      )}
      {child &&
        // In the future, we may switch here between available intents
        React.cloneElement(child, {
          t,
          client,
          appData: appData,
          compose: service.compose,
          data: service.getData(),
          intent: service.getIntent(),
          onCancel: () => service.cancel(),
          onError: error => service.throw(error),
          onTerminate: app => service.terminate(app)
        })}
    </div>
  )
}

export default IntentHandler
