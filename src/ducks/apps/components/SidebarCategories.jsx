import React, { Component } from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { NavLink as RouterLink, useLocation } from 'react-router-dom'

import { categoryUtils } from 'cozy-ui/transpiled/react/AppSections'

const getActiveChecker = (path, location) =>
  `${location.pathname}${location.search}` === path

const renderLink = (cat, path, location) => {
  console.log('YANNICK renderLink', cat, path)

  const isActive = getActiveChecker(path, location)
  return (
    <li key={path}>
      <RouterLink
        // className={`sto-side-menu-item${cat.secondary ? ' --secondary' : ''}`}
        to={path}
        // activeClassName="active"
        // isActive={getActiveChecker(path)}
        exact
        className={() => {
          const className = `sto-side-menu-item${cat.secondary ? ' --secondary' : ''}`

          return isActive ? className + ' active' : className
        }}
      >
        {cat.label}
      </RouterLink>
    </li>
  )
}

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

    const addLabel = cat => categoryUtils.addLabel(cat, t)
    const options = categoryUtils.generateOptionsFromApps(appsList, {
      includeAll: false,
      addLabel
    })

    // compute sidebar categories links
    const linksArray = options.map(cat => {
      if (cat.value === 'konnectors') {
        return renderLink(cat, `${parent}?type=konnector`, location)
      } else {
        return renderLink(
          cat,
          `${parent}?type=${cat.type}&category=${cat.value}`,
          location
        )
      }
    })

    return <ul className="sto-side-menu">{linksArray}</ul>
  }
}

const SidebarCategoriesWrapper = props => {
  const location = useLocation()
  return <SidebarCategories {...props} location={location} />
}

export default translate()(withBreakpoints()(SidebarCategoriesWrapper))
