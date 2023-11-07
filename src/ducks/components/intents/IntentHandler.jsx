import React, { Children, Component } from 'react'

import { withClient } from 'cozy-client'
import Intents from 'cozy-interapp'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

const CREATING = 'creating'
const CREATED = 'created'
const ERRORED = 'errored'

class IntentHandler extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      service: null,
      status: CREATING
    }

    const client = this.props.client
    const intents = new Intents({ client })
    intents
      .createService()
      .then(service =>
        this.setState({
          status: CREATED,
          service: service
        })
      )
      .catch(error =>
        this.setState({
          error: error,
          status: ERRORED
        })
      )
  }

  render() {
    const { appData, children, t } = this.props
    const { error, service, status } = this.state
    const intent = service && service.getIntent()
    const isCreating = status === CREATING
    const child =
      intent &&
      Children.toArray(children).find(child => {
        const { action, type } = child.props
        return (
          action === intent.attributes.action && type === intent.attributes.type
        )
      })

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
}

export default withClient(translate()(IntentHandler))
