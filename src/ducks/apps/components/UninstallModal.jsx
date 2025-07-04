import { getAppBySlug, uninstallApp } from '@/ducks/apps'
import ReactMarkdownWrapper from '@/ducks/components/ReactMarkdownWrapper'
import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withClient } from 'cozy-client'
import Intents from 'cozy-interapp'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import Portal from 'cozy-ui/transpiled/react/Portal'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import Modal, {
  ModalDescription,
  ModalFooter
} from 'cozy-ui/transpiled/react/deprecated/Modal'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

export class UninstallModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirecting: false
    }

    const { app, onNotInstalled } = props
    if (app && !app.installed) {
      onNotInstalled()
    }

    this.handleUninstallApp = this.handleUninstallApp.bind(this)
  }

  componentDidUpdate = prevProps => {
    const { app, onSuccess, t } = this.props
    const haveJustBeenUninstalled = prevProps.app.installed && !app.installed
    if (haveJustBeenUninstalled) {
      Alerter.success(t('app_modal.uninstall.message.success'), {
        duration: 3000
      })
      onSuccess()
    }
  }

  handleUninstallApp() {
    const { app, uninstallApp } = this.props
    uninstallApp(app)
  }

  toggleRedirect = async () => {
    if (this.state.redirecting) return // don't toggle twice
    this.setState(() => ({ redirecting: true }))
    try {
      const intents = new Intents({ client: this.props.client })
      await intents.redirect('io.cozy.settings', {
        step: 'connectedDevices'
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      this.setState({
        redirecting: false
      })
    }
  }

  render() {
    const {
      isUninstalling,
      isInstalling,
      dismissAction,
      t,
      uninstallError,
      client
    } = this.props
    const linkedAppError =
      uninstallError &&
      uninstallError.message === 'A linked OAuth client exists for this app'
    return (
      <Portal into="body">
        <Modal
          title={t('app_modal.uninstall.title')}
          dismissAction={dismissAction}
          mobileFullscreen
          className="sto-modal--uninstall"
        >
          <ModalDescription>
            <ReactMarkdownWrapper
              source={t('app_modal.uninstall.description', {
                cozyName: client.stackClient.uri.replace(/^\/\//, '')
              })}
            />
            {uninstallError && !linkedAppError && (
              <p className="u-error">
                {t('app_modal.uninstall.message.error', {
                  message: uninstallError.message
                })}
              </p>
            )}
            {linkedAppError && (
              <p className="u-error">
                {t('app_modal.uninstall.linked_app.error')}
                &nbsp;
                <a
                  className="u-c-pointer u-dodgerBlue"
                  onClick={this.toggleRedirect}
                >
                  {t('app_modal.uninstall.linked_app.link')}
                </a>
                .
              </p>
            )}
          </ModalDescription>
          <ModalFooter className="sto-modal-controls">
            <Buttons
              variant="secondary"
              onClick={dismissAction}
              label={t('app_modal.uninstall.cancel')}
              className="u-flex-grow-1 u-mh-half"
            />
            <Buttons
              variant="primary"
              onClick={this.handleUninstallApp}
              label={t('app_modal.uninstall.uninstall')}
              className="u-flex-grow-1 u-mh-half"
              color="error"
              startIcon={<Icon icon={TrashIcon} />}
              busy={isUninstalling}
              disabled={isUninstalling || isInstalling || !!linkedAppError}
            />
          </ModalFooter>
        </Modal>
      </Portal>
    )
  }
}

UninstallModal.propTypes = {
  app: PropTypes.object.isRequired,
  dismissAction: PropTypes.func.isRequired,
  onNotInstalled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  app: getAppBySlug(state, ownProps.appSlug),
  isUninstalling: state.apps.isUninstalling,
  isInstalling: state.apps.isInstalling,
  uninstallError: state.apps.actionError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uninstallApp: app => {
    return dispatch(uninstallApp(ownProps.client, app))
  }
})

export default compose(
  withClient,
  connect(mapStateToProps, mapDispatchToProps),
  translate()
)(UninstallModal)
