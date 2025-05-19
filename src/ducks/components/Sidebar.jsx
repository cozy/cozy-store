import config from '@/config/index.json'
import { SidebarCategories } from '@/ducks/apps/Containers'
import isNavigationEnabled from '@/lib/isNavigationEnabled'
import React, { Fragment } from 'react'
import { NavLink as RouterLink, useLocation } from 'react-router-dom'

import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import CompassIcon from 'cozy-ui/transpiled/react/Icons/Compass'
import Nav, {
  NavLink,
  NavItem,
  NavIcon,
  NavText
} from 'cozy-ui/transpiled/react/Nav'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

const configMap = {
  discover: {
    icon: CompassIcon,
    labelKey: 'nav.discover'
  },
  myapps: {
    icon: CloudIcon,
    labelKey: 'nav.myapps'
  }
}

export const StoreSidebar = React.memo(({ t, breakpoints = {} }) => {
  const location = useLocation()
  const { isMobile, isTablet } = breakpoints
  if (config.enabledPages.length === 1 && (isMobile || isTablet)) return null
  if (!isNavigationEnabled(location.search)) return null

  return (
    <Sidebar>
      <Nav>
        {config.enabledPages.map(name => {
          if (configMap[name]) {
            return (
              <Fragment key={name}>
                <NavItem>
                  <RouterLink
                    to={`/${name}`}
                    className={({ isActive }) =>
                      isActive
                        ? `${NavLink.activeClassName} ${NavLink.className}`
                        : NavLink.className
                    }
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
