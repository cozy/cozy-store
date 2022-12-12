/* global cozy */
import React, { useState, useRef } from 'react'
import Button from 'cozy-ui/transpiled/react/Buttons'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import ActionMenu, {
  ActionMenuItem,
  ActionMenuRadio
} from 'cozy-ui/transpiled/react/ActionMenu'
import SettingIcon from 'cozy-ui/transpiled/react/Icons/Setting'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const { BarRight } = cozy.bar

const Filters = ({ filter, onFilterChange }) => {
  const anchorRef = useRef()
  const [menuDisplayed, setMenuDisplayed] = useState(false)

  const areAppsUnderMaintenanceShown = filter.showMaintenance

  const toggleMenu = () => {
    setMenuDisplayed(!menuDisplayed)
  }

  const hideMenu = () => {
    setMenuDisplayed(false)
  }

  const showAppUnderMaintenance = () => {
    if (!areAppsUnderMaintenanceShown) {
      onFilterChange({
        ...filter,
        showMaintenance: true
      })
    }
  }

  const hideAppUnderMaintenance = () => {
    if (areAppsUnderMaintenanceShown) {
      delete filter.showMaintenance
      onFilterChange(filter)
    }
  }

  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  return (
    <>
      {isMobile ? (
        <BarRight>
          <IconButton
            onClick={toggleMenu}
            ref={anchorRef}
            aria-label={t('sections.filters.action')}
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
        />
      )}

      {menuDisplayed && (
        <ActionMenu
          anchorElRef={anchorRef}
          autoclose={true}
          onClose={hideMenu}
          popperOptions={{
            placement: 'bottom-end'
          }}
        >
          <ActionMenuItem
            onClick={showAppUnderMaintenance}
            left={<ActionMenuRadio checked={areAppsUnderMaintenanceShown} />}
          >
            {t('sections.filters.under_maintenance.show')}
          </ActionMenuItem>
          <ActionMenuItem
            onClick={hideAppUnderMaintenance}
            left={<ActionMenuRadio checked={!areAppsUnderMaintenanceShown} />}
          >
            {t('sections.filters.under_maintenance.hide')}
          </ActionMenuItem>
        </ActionMenu>
      )}
    </>
  )
}

export default Filters
