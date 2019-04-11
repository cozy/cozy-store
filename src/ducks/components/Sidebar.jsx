import React, { Fragment } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { NavLink as RouterLink, withRouter } from 'react-router-dom'
import Nav, { NavLink, NavItem, NavIcon, NavText } from 'cozy-ui/react/Nav'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import discoverIcon from 'assets/icons/icon-compass.svg'
import myAppsIcon from 'assets/icons/icon-cozy-smile.svg'

import { SidebarCategories } from 'ducks/apps/Containers'
import { enabledStoreParts } from 'config'
import isNavigationEnabled from 'lib/isNavigationEnabled'

const configMap = {
  discover: {
    icon: discoverIcon,
    labelKey: 'nav.discover'
  },
  myapps: {
    icon: myAppsIcon,
    labelKey: 'nav.myapps'
  }
}

export const Sidebar = React.memo(({ location, t, breakpoints = {} }) => {
  const { isMobile, isTablet } = breakpoints
  const parts = enabledStoreParts || ['discover', 'myapps']
  if (parts.length === 1 && (isMobile || isTablet)) return null
  if (!isNavigationEnabled(location.search)) return null
  return (
    <aside className="o-sidebar">
      <Nav>
        {parts.map(name => {
          if (configMap.hasOwnProperty(name)) {
            return (
              <Fragment key={name}>
                <NavItem>
                  <RouterLink
                    to={`/${name}`}
                    className={NavLink.className}
                    activeClassName={NavLink.activeClassName}
                  >
                    <NavIcon icon={configMap[name].icon} />
                    <NavText>{t(configMap[name].labelKey)}</NavText>
                  </RouterLink>
                </NavItem>
                <SidebarCategories parent={`/${name}`} />
              </Fragment>
            )
          }
        })}
      </Nav>
    </aside>
  )
})
Sidebar.displayName = 'Sidebar'

export default translate()(withBreakpoints()(withRouter(Sidebar)))
