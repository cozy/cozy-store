import GithubIcon from 'assets/icons/icon-github.svg'
import React, { useState } from 'react'

import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Buttons'
import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'
import Icon from 'cozy-ui/transpiled/react/Icon'
import InfoOutlinedIcon from 'cozy-ui/transpiled/react/Icons/InfoOutlined'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const PushBanner = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  return (
    <Banner
      bgcolor="var(--defaultBackgroundColor)"
      icon={<Icon icon={GithubIcon} size={32} />}
      text={
        <>
          <Typography variant="body2" component="span">
            {t('pushBanner.line-one')}
          </Typography>
          <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <Tooltip
              open={isMobile ? showTooltip : undefined}
              title={
                <>
                  <div className="u-flex u-flex-items-center u-mb-half">
                    <Typography variant="body1" color="inherit">
                      {t('pushBanner.tooltip.title')}
                    </Typography>
                  </div>
                  <Typography variant="caption" color="inherit">
                    {t('pushBanner.tooltip.text')}
                  </Typography>
                </>
              }
            >
              <span>
                <Icon
                  style={{ verticalAlign: 'text-bottom', marginLeft: 4 }}
                  icon={InfoOutlinedIcon}
                  onClick={isMobile ? () => setShowTooltip(v => !v) : undefined}
                />
              </span>
            </Tooltip>
          </ClickAwayListener>
          <Typography className="u-db" variant="body2" component="span">
            {t('pushBanner.line-two')}
          </Typography>
        </>
      }
      buttonOne={
        <Button
          component="a"
          href="https://github.com/linagora"
          target="_blank"
          variant="text"
          startIcon={<Icon icon={OpenwithIcon} />}
          label={t('pushBanner.link')}
        />
      }
      inline
      noDivider
    />
  )
}

export default PushBanner
