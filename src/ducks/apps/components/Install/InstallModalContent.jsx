import React, { Component } from 'react'

import { ModalContent } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'

import { translate } from 'cozy-ui/react/I18n'
import { SubTitle } from 'cozy-ui/react/Text'
import AnimatedModalHeader from 'ducks/components/AnimatedModalHeader'
import TransparencyLabel from '../TransparencyLabel'

export class InstallModalContent extends Component {
  render() {
    const { app, fetchError, isFetching, isCanceling, t } = this.props
    const isFirstLoading = isFetching && !isCanceling
    // this part must not be wrapped in a component
    // so we get the content using it as a function
    const animatedHeader = AnimatedModalHeader({
      app
    })

    return isFirstLoading ? (
      <ModalContent className="sto-modal-content">
        <div className="sto-install-loading">
          <Spinner size="xlarge" />
        </div>
      </ModalContent>
    ) : (
      <ModalContent className="sto-modal-content">
        {animatedHeader}
        <SubTitle className="sto-modal-title">
          {t('app_modal.install.title')}
        </SubTitle>
        <TransparencyLabel app={app} />
        {fetchError && (
          <p className="u-error">
            {t('app_modal.install.message.version_error', {
              message: fetchError.message
            })}
          </p>
        )}
      </ModalContent>
    )
  }
}

export default translate()(InstallModalContent)
