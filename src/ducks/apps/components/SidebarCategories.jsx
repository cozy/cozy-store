import React from 'react'
import { NavLink as RouterLink, useLocation } from 'react-router-dom'

import { categoryUtils } from 'cozy-ui/transpiled/react/AppSections'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

const getActiveChecker = (cat, location) => {
  const urlSearchParams = new URLSearchParams(location.search)
  const params = Object.fromEntries([...urlSearchParams])

  if (
    (cat.value === params.category && cat.type === params.type) ||
    (cat.value === 'konnectors' &&
      params.type === 'konnector' &&
      params.category === undefined)
  ) {
    return true
  }

  return false
}

const renderLink = (cat, path, location) => {
  const isActive = getActiveChecker(cat, location)

  return (
    <li key={path}>
      <RouterLink
        to={path}
        end
        className={() => {
          const className = `sto-side-menu-item${
            cat.secondary ? ' --secondary' : ''
          }`

          return isActive ? className + ' active' : className
        }}
      >
        {cat.label}
      </RouterLink>
    </li>
  )
}

export const SidebarCategories = ({
  t,
  apps,
  installedApps,
  parent,
  breakpoints = {}
}) => {
  const location = useLocation()
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

  const params = new URLSearchParams(location.search)
  params.delete('type')
  params.delete('category')
  const extraParams = params.toString() !== '' ? '&' + params.toString() : ''

  // compute sidebar categories links
  const linksArray = options.map(cat => {
    if (cat.value === 'konnectors') {
      return renderLink(cat, `${parent}?type=konnector${extraParams}`, location)
    } else {
      return renderLink(
        cat,
        `${parent}?type=${cat.type}&category=${cat.value}${extraParams}`,
        location
      )
    }
  })

  return <ul className="sto-side-menu">{linksArray}</ul>
}

export default translate()(withBreakpoints()(SidebarCategories))
