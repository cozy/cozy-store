import { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { withRouter } from 'react-router'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

export class ScrollToTop extends Component {
  constructor(props) {
    super(props)
    this.state = { scrollListPosition: 0 }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      // three length match array
      const prev = prevProps.location.pathname.match(/^\/([^/?&]*)\/?(.*)/)
      const next = this.props.location.pathname.match(/^\/([^/?&]*)\/?(.*)/)
      // if same parent path
      if (prev && next && prev[1] === next[1]) {
        if (!prev[2] && next[2]) {
          // i.e. /discover to /discover/drive
          // we save the scroll position
          let scrollState = 0
          if (this.props.breakpoints.isDesktop) {
            // eslint-disable-next-line react/no-find-dom-node
            const domNode = this.props.target && findDOMNode(this.props.target)
            scrollState = domNode.scrollTop
          } else {
            scrollState =
              document.documentElement.scrollTop || document.body.scrollTop
          }
          this.setState({ scrollListPosition: scrollState })
          return null
        } else if (prev[2] && !next[2]) {
          // i.e. /discover/drive to /discover
          return this.state.scrollListPosition
        }
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, scrollSnapshot) {
    if (this.props.location !== prevProps.location) {
      if (this.props.breakpoints.isDesktop) {
        // eslint-disable-next-line react/no-find-dom-node
        const domNode = this.props.target && findDOMNode(this.props.target)
        domNode.scrollTop = scrollSnapshot || 0
      } else {
        document.documentElement.scrollTop = scrollSnapshot || 0
        document.body.scrollTop = scrollSnapshot || 0 // safari
      }
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(withBreakpoints()(ScrollToTop))
