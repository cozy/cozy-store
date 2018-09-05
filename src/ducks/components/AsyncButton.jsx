import React, { Component } from 'react'

import Button from 'cozy-ui/react/Button'

const IDLE = 'idle'
const WORKING = 'working'

class AsyncButton extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isFunctional: typeof props.asyncAction === 'function',
      status: IDLE
    }
  }

  asyncAction = () => {
    const { asyncAction } = this.props
    const { isFunctional } = this.state
    if (isFunctional) {
      this.setState({ status: WORKING })
      try {
        asyncAction()
      } catch (error) {
        this.setState({ status: IDLE })
      }
    }
  }

  render() {
    const { isFunctional, status } = this.state
    const isWorking = status === WORKING
    return (
      <Button
        {...this.props}
        busy={isWorking}
        disabled={isWorking || !isFunctional}
        onClick={this.asyncAction}
      />
    )
  }
}

export default AsyncButton
