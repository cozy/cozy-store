import { Component } from 'react'
import { withRouter } from 'react-router'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

// a component to automatically reset the scroll
// on mount (see https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top)
export class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (!this.props.breakpoints.isDesktop) {
        // on mobile we scroll on <html />
        document.documentElement.scrollTo(0, 0)
      } else {
        const domNode = this.props.target && this.props.target.getDOMNode()
        domNode.scrollTo(0, 0)
      }
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(withBreakpoints()(ScrollToTop))
