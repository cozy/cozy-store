import React, { useState, useRef, forwardRef } from 'react'
import { useI18n } from 'twake-i18n'

import { BarRight } from 'cozy-bar'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import SettingIcon from 'cozy-ui/transpiled/react/Icons/Setting'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const Filters = ({ filter, onFilterChange }) => {
  const anchorRef = useRef(null)
  const [menuDisplayed, setMenuDisplayed] = useState(false)

  const areAppsUnderMaintenanceShown = filter.showMaintenance

  const toggleMenu = () => {
    setMenuDisplayed(!menuDisplayed)
  }

  const hideMenu = () => {
    setMenuDisplayed(false)
  }

  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const showAppUnderMaintenance = () => ({
    name: 'showAppUnderMaintenance',
    action: () => {
      if (!areAppsUnderMaintenanceShown) {
        onFilterChange({
          ...filter,
          showMaintenance: true
        })
      }
    },
    Component: forwardRef(function ShowAppUnderMaintenanceItem(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Radio checked={areAppsUnderMaintenanceShown} />
          </ListItemIcon>
          <ListItemText
            primary={t('sections.filters.under_maintenance.show')}
          />
        </ActionsMenuItem>
      )
    })
  })

  const hideAppUnderMaintenance = () => ({
    name: 'hideAppUnderMaintenance',
    action: () => {
      if (areAppsUnderMaintenanceShown) {
        delete filter.showMaintenance
        onFilterChange(filter)
      }
    },
    Component: forwardRef(function HideAppUnderMaintenanceItem(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Radio checked={!areAppsUnderMaintenanceShown} />
          </ListItemIcon>
          <ListItemText
            primary={t('sections.filters.under_maintenance.hide')}
          />
        </ActionsMenuItem>
      )
    })
  })

  const actions = makeActions([
    showAppUnderMaintenance,
    hideAppUnderMaintenance
  ])

  return (
    <>
      {isMobile ? (
        <BarRight>
          <IconButton
            onClick={toggleMenu}
            ref={anchorRef}
            aria-label={t('sections.filters.action')}
            aria-controls="simple-menu"
            aria-haspopup="true"
          >
            <Icon icon={SettingIcon} />
          </IconButton>
        </BarRight>
      ) : (
        <Button
          variant="secondary"
          label={t('sections.filters.action')}
          onClick={toggleMenu}
          ref={anchorRef}
          startIcon={<Icon icon={SettingIcon} />}
          aria-controls="simple-menu"
          aria-haspopup="true"
        />
      )}

      {menuDisplayed && (
        <ActionsMenu
          open
          ref={anchorRef}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          actions={actions}
          onClose={hideMenu}
        />
      )}
    </>
  )
}

export default Filters
