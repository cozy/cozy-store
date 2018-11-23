import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { NavLink as RouterLink } from 'react-router-dom'
import Nav, { NavLink, NavItem, NavIcon, NavText } from 'cozy-ui/react/Nav'

import discoverIcon from 'assets/icons/icon-compass.svg'
import myAppsIcon from 'assets/icons/icon-cozy-smile.svg'

import { SidebarCategories } from 'ducks/apps/Containers'

export const Sidebar = ({ t }) => (
  <aside className="o-sidebar">
    <Nav>
      <NavItem>
        <RouterLink
          to="/discover"
          className={NavLink.className}
          activeClassName={NavLink.activeClassName}
        >
          <NavIcon icon={discoverIcon} />
          <NavText>{t('nav.discover')}</NavText>
        </RouterLink>
      </NavItem>
      <SidebarCategories parent="/discover" />
      <NavItem>
        <RouterLink
          to="/myapps"
          className={NavLink.className}
          activeClassName={NavLink.activeClassName}
        >
          <NavIcon icon={myAppsIcon} />
          <NavText>{t('nav.myapps')}</NavText>
        </RouterLink>
      </NavItem>
      <SidebarCategories parent="/myapps" />
    </Nav>
  </aside>
)

export default translate()(Sidebar)
