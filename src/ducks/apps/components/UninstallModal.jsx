/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'
import Button from 'cozy-ui/react/Button'
import { getAppBySlug, uninstallApp } from 'ducks/apps'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

export class UninstallModal extends Component {
  constructor(props) {
    super(props)

    const { app, onNotInstalled } = props
    if (app && !app.installed) {
      onNotInstalled()
    }
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

  uninstallApp = () => {
    const { app, uninstallApp } = this.props
    uninstallApp(app)
  }

  render() {
    const { isUninstalling, dismissAction, t, uninstallError } = this.props
    return (
      <div className="sto-modal--uninstall">
        <Modal
          title={t('app_modal.uninstall.title')}
          dismissAction={dismissAction}
          mobileFullscreen
        >
          <ModalContent>
            <div className="sto-modal-content">
              <ReactMarkdownWrapper
                source={t('app_modal.uninstall.description', {
                  cozyName: cozy.client._url.replace(/^\/\//, '')
                })}
              />
              {uninstallError && (
                <p className="u-error">
                  {t('app_modal.uninstall.message.error', {
                    message: uninstallError.message
                  })}
                </p>
              )}
              <div className="sto-modal-controls">
                <button
                  role="button"
                  className="c-btn c-btn--secondary"
                  onClick={dismissAction}
                >
                  <span>{t('app_modal.uninstall.cancel')}</span>
                </button>
                <Button
                  busy={isUninstalling}
                  disabled={isUninstalling}
                  theme="danger"
                  icon="delete"
                  onClick={this.uninstallApp}
                  label={t('app_modal.uninstall.uninstall')}
                />
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
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
  uninstallError: state.apps.actionError
})

const mapDispatchToProps = dispatch => ({
  uninstallApp: app => {
    return dispatch(uninstallApp(app))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(withRouter(UninstallModal)))
