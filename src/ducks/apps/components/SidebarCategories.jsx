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
    const konnectorsList = appsList.filter(a => a.type === 'konnector')
    const webappsCategories = getCategoriesSelections(
      appsList.filter(a => a.type === 'webapp'),
      t,
      konnectorsList.length ? ['konnectors'] : []
    )
    const konnectorsCategories = getCategoriesSelections(konnectorsList, t, [])

    // compute sidebar categories links
    const linksArray = webappsCategories.reduce((all, current) => {
      switch (current.value) {
        case 'konnectors': {
          all.push(renderLink(current, `${parent}?type=konnector`))
          for (const kCategory of konnectorsCategories) {
            all.push(
              renderLink(
                kCategory,
                `${parent}?type=konnector&category=${kCategory.value}`,
                true
              )
            )
          }
          return all
        }
        case 'webapps': {
          all.push(renderLink(current, `${parent}?type=webapp`))
          return all
        }
        default: {
          all.push(
            renderLink(
              current,
              `${parent}?type=webapp&category=${current.value}`
            )
          )
          return all
        }
      }
    }, [])

    return <ul className="sto-side-menu">{linksArray}</ul>
  }
}

export default translate()(withBreakpoints()(SidebarCategories))
