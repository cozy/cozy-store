import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { NavLink as RouterLink } from 'react-router-dom'

import { getCategoriesSelections } from 'lib/helpers'

const getActiveChecker = path => (match, location) =>
  `${location.pathname}${location.search}` === path

const renderLink = (cat, path) => (
  <li key={cat.value}>
    <RouterLink
      className={`sto-side-menu-item${cat.secondary ? ' --secondary' : ''}`}
      to={path}
      activeClassName="active"
      isActive={getActiveChecker(path)}
      exact
    >
      {cat.label}
    </RouterLink>
  </li>
)

export class SidebarCategories extends Component {
  render() {
    const {
      t,
      apps,
      installedApps,
      location,
      parent,
      breakpoints = {}
    } = this.props
    const { isMobile, isTablet } = breakpoints
    if (
      isMobile ||
      isTablet ||
      location.pathname.match(new RegExp(parent)) === null
    )
      return null
    let appsList = []
    switch (parent) {
      case '/discover':
        appsList = apps
        break
      case '/myapps':
        appsList = installedApps
        break
      default:
        return null // no list return nothing to the renderer
    }

    const categories = getCategoriesSelections(appsList, t)

    // compute sidebar categories links
    const linksArray = categories.map(cat => {
      if (cat.value === 'konnectors') {
        return renderLink(cat, `${parent}?type=konnector`)
      } else {
        return renderLink(
          cat,
          `${parent}?type=${cat.type}&category=${cat.value}`
        )
      }
    })

    return <ul className="sto-side-menu">{linksArray}</ul>
  }
}

export default translate()(withBreakpoints()(SidebarCategories))
