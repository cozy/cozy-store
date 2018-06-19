import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { NavLink as RouterLink } from 'react-router-dom'

import { getCategoriesSelections } from 'lib/helpers'

const getActiveChecker = path => (match, location) =>
  `${location.pathname}${location.search}` === path

const renderLink = (cat, path, isSecondary) => (
  <li key={cat.value}>
    <RouterLink
      className={`sto-side-menu-item${isSecondary ? ' --secondary' : ''}`}
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
    const categoriesSelections = getCategoriesSelections(appsList, t)
    return (
      <ul className="sto-side-menu">
        {categoriesSelections.map(cat => {
          switch (cat.value) {
            case 'all':
              return renderLink(cat, parent)
            case 'konnectors': {
              const path = `${parent}?type=konnector`
              return renderLink(cat, path)
            }
            case 'webapps': {
              const path = `${parent}?type=webapp`
              return renderLink(cat, path)
            }
            default: {
              const path = `${parent}?category=${cat.value}`
              return renderLink(cat, path, true)
            }
          }
        })}
      </ul>
    )
  }
}

export default translate()(withBreakpoints()(SidebarCategories))
