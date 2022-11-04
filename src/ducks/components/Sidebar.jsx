import React, { Fragment } from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { NavLink as RouterLink, withRouter } from 'react-router-dom'
import Nav, {
  NavLink,
  NavItem,
  NavIcon,
  NavText
} from 'cozy-ui/transpiled/react/Nav'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'

import discoverIcon from 'assets/icons/icon-compass.svg'
import myAppsIcon from 'assets/icons/icon-cozy-smile.svg'

import { SidebarCategories } from 'ducks/apps/Containers'
import { enabledPages } from 'config'
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

export const StoreSidebar = React.memo(({ location, t, breakpoints = {} }) => {
  const { isMobile, isTablet } = breakpoints
  if (enabledPages.length === 1 && (isMobile || isTablet)) return null
  if (!isNavigationEnabled(location.search)) return null
  return (
    <Sidebar>
      <Nav>
        {enabledPages.map(name => {
          if (configMap[name]) {
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
    </Sidebar>
  )
})
StoreSidebar.displayName = 'Sidebar'

export default translate()(withBreakpoints()(StoreSidebar))
