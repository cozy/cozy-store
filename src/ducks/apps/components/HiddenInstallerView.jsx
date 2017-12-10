import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import Toggle from 'cozy-ui/react/Toggle'
import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

class HiddenInstallerView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      slug: null,
      source: null,
      isUpdate: false,
      isSuccess: false,
      isErrored: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onChange (name, value) {
    this.setState({ [name]: value })
  }

  handleSubmit () {
    const { slug, source, isUpdate } = this.state
    this.props.installUsingInstaller(slug, source, isUpdate)
  }

  isValid () {
    const { slug, source } = this.state
    if (!slug) return false
    if (
      !source.match(/(^registry:\/\/)|(^git(\+ssh)?:\/\/)|(^http(s)?:\/\/)/)
    ) {
      return false
    }
    return true
  }

  render () {
    const { t, isInstalling, actionError } = this.props
    const error =
      actionError &&
      ((actionError.reason.errors && actionError.reason.errors[0]) || {
        detail: actionError.reason
      })
    return (
      <div role='contentinfo'>
        <div className='sto-content sto-hidden-install'>
          <h2 className='sto-installer-title'>
            {t('HiddenInstallerView.title')}
          </h2>
          <div className='coz-form'>
            <div className='sto-installer-field'>
              <ReactMarkdownWrapper
                source={t('HiddenInstallerView.source_examples')}
              />
              <h3>{t('HiddenInstallerView.source')}</h3>
              <input
                placeholder={t('HiddenInstallerView.source_placeholder')}
                type='text'
                name='source'
                onChange={e =>
                  this.onChange(e.target.name, e.target.value.trim())
                }
              />
            </div>
            <div className='sto-installer-field'>
              <h3>{t('HiddenInstallerView.slug')}</h3>
              <input
                type='text'
                name='slug'
                onChange={e => this.onChange(e.target.name, e.target.value)}
              />
            </div>
            <div className='sto-installer-field'>
              <h3>{t('HiddenInstallerView.update')}</h3>
              <Toggle
                id='isUpdate'
                checked={this.state.isUpdate}
                onToggle={() => this.onChange('isUpdate', !this.state.isUpdate)}
              />
            </div>
            {actionError && (
              <p className='coz-error'>
                {actionError.status === 409
                  ? t('HiddenInstallerView.conflict')
                  : `Error: ${error.detail}`}
              </p>
            )}
            <div className='coz-form-controls'>
              <button
                role='button'
                disabled={isInstalling || !this.isValid()}
                aria-busy={isInstalling}
                className='c-btn c-btn--regular'
                onClick={this.handleSubmit}
              >
                {t('HiddenInstallerView.install')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate()(HiddenInstallerView)
