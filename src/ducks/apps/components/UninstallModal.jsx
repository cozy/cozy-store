/* global cozy */

import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'
import AnimatedModalHeader from 'ducks/components/AnimatedModalHeader'

export class UninstallModal extends Component {
  constructor(props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
    this.uninstallApp = this.uninstallApp.bind(this)
  }

  uninstallApp() {
    this.setState({ error: null })
    const { app } = this.props
    this.props.uninstallApp(app.slug, app.type)
  }

  gotoParent() {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(parent)
    }
  }

  render() {
    const { t, app, uninstallError } = this.props
    // if app not found, return to parent
    if (!app) {
      this.gotoParent()
      return null
    }
    const animatedHeader = AnimatedModalHeader({
      app
    })
    return (
      <div className="sto-modal--uninstall">
        <Modal dismissAction={this.gotoParent} mobileFullscreen>
          <ModalContent>
            {animatedHeader}
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
                  onClick={this.gotoParent}
                >
                  <span>{t('app_modal.uninstall.cancel')}</span>
                </button>
                <button
                  role="button"
                  className="c-btn c-btn--danger c-btn--delete"
                  onClick={this.uninstallApp}
                >
                  <span>{t('app_modal.uninstall.uninstall')}</span>
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(withRouter(UninstallModal))
