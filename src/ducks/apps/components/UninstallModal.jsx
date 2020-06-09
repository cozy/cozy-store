import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Button from 'cozy-ui/transpiled/react/Button'
import { getAppBySlug, uninstallApp } from 'ducks/apps'
import Modal, {
  ModalDescription,
  ModalFooter
} from 'cozy-ui/transpiled/react/Modal'
import Portal from 'cozy-ui/transpiled/react/Portal'
import { withClient } from 'cozy-client'
import Intents from 'cozy-interapp'

import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

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
            <Button
              theme="secondary"
              onClick={dismissAction}
              label={t('app_modal.uninstall.cancel')}
              extension="full"
              className="u-mh-half"
            />
            <Button
              busy={isUninstalling}
              disabled={isUninstalling || isInstalling || !!linkedAppError}
              theme="danger"
              icon="trash"
              onClick={this.handleUninstallApp}
              label={t('app_modal.uninstall.uninstall')}
              extension="full"
              className="u-mh-half"
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  translate(),
  withRouter
)(UninstallModal)
