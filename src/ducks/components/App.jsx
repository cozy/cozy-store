
import React, { Component } from 'react'

import Sidebar from './Sidebar'
import { Route, Switch, Redirect } from 'react-router-dom'

import MyApplications from '../myApps/Container'
import Discover from './Discover'
import { translate } from 'cozy-ui/react/helpers/i18n'
import Modal from 'cozy-ui/react/Modal'
import { Alerter } from 'cozy-ui/react/Alerter'

export class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      soonModal: false
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal () {
    this.setState({
      soonModal: !this.state.soonModal
    })
  }

  render () {
    const { t } = this.props
    const { soonModal } = this.state
    return (
      <div className='sto-wrapper coz-sticky'>
        <Alerter />
        <Sidebar />
        {soonModal && <Modal
          title={t('soon.title')}
          description={t('soon.description')}
          secondaryAction={this.toggleModal}
        />}
        <main className='sto-content'>
          <Switch>
            <Route path='/discover' component={Discover} />
            <Route path='/myapps' component={MyApplications} />
            <Redirect exact from='/' to='/myapps' />
          </Switch>
        </main>
      </div>
    )
  }
}
export default translate()(App)
