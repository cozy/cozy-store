import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { NavLink } from 'react-router-dom'

export const Nav = ({ t }) => (
  <nav>
    <ul className='coz-nav'>
      <li className='coz-nav-item'>
        <NavLink to='/discover' className='sto-cat-discover coz-nav-link' activeClassName='active'>
          { t('nav.discover') }
        </NavLink>
      </li>
      <li className='coz-nav-item'>
        <NavLink to='/myapps' className='sto-cat-myapps coz-nav-link' activeClassName='active'>
          { t('nav.myapps') }
        </NavLink>
      </li>
    </ul>
  </nav>
)

export default translate()(Nav)
