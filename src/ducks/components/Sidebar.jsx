import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { NavLink } from 'react-router-dom'

export const Sidebar = ({ t }) => (
  <aside className='coz-sidebar'>
    <nav>
      <ul className='c-nav'>
        <li className='c-nav-item'>
          <NavLink to='/discover' className='sto-cat-discover c-nav-link' activeClassName='active'>
            { t('nav.discover') }
          </NavLink>
        </li>
        <li className='c-nav-item'>
          <NavLink to='/myapps' className='sto-cat-myapps c-nav-link' activeClassName='active'>
            { t('nav.myapps') }
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
)

export default translate()(Sidebar)
