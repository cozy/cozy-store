import React, { Component } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'

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
    const { icon, className, label } = this.props

    const isWorking = status === WORKING

    return (
      <Button
        busy={isWorking}
        className={className}
        disabled={isWorking || !isFunctional}
        startIcon={icon ? <Icon icon={icon} /> : undefined}
        label={label}
        onClick={this.asyncAction}
      />
    )
  }
}

export default AsyncButton
