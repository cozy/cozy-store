import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import InstallAppIntent from './InstallAppIntent'
import Spinner from 'cozy-ui/react/Spinner'

class IntentHandler extends Component {
  constructor(props, context) {
    super(props)

    this.state = {
      error: null,
      service: null,
      status: 'creating'
    }

    props.intents
      .createService()
    // Free : easy mocking !
    // Promise.resolve({
    //   getData: () => ({ slug: <konnector slug> }),
    //   getIntent: () => ({ action: 'INSTALL', type: 'io.cozy.apps' }),
    //   terminate: (doc) => { alert(`Installed ${doc.name}`) }
    // })
      .then(service =>
        this.setState({
          status: 'created',
          service: service
        })
      )
      .catch(error =>
        this.setState({
          error: error,
          status: 'errored'
        })
      )
  }

  render() {
    const { appData, t } = this.props
    const { error, service, status } = this.state

    return (
      <div className="coz-intent">
        {status === 'creating' && <Spinner size="xxlarge" />}
        {error && (
          <div className="coz-error coz-intent-error">
            <p>{t('intent.service.creation.error.title')}</p>
            <p>{error.message}</p>
          </div>
        )}
        {status === 'created' && (
          // In the future, we may switch here between available intents
          <InstallAppIntent
            appData={appData}
            data={service.getData()}
            intent={service.getIntent()}
            onCancel={() => service.cancel()}
            onError={error => service.throw(error)}
            onTerminate={app => service.terminate(app)}
          />
        )}
      </div>
    )
  }
}

export default translate()(IntentHandler)
