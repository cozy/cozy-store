import React from 'react'
// import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'
import { Caption } from 'cozy-ui/react/Text'
import Accordion, { AccordionItem } from 'cozy-ui/react/Accordion'

import PermissionsList from './PermissionsList'
import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'

import labelImage_A from 'assets/label/A.svg'
import labelImage_B from 'assets/label/B.svg'
import labelImage_C from 'assets/label/C.svg'
import labelImage_D from 'assets/label/D.svg'
import labelImage_E from 'assets/label/E.svg'
import labelImage_F from 'assets/label/F.svg'

const labelImages = {
  A: labelImage_A,
  B: labelImage_B,
  C: labelImage_C,
  D: labelImage_D,
  E: labelImage_E,
  F: labelImage_F
}

export const TransparencyLabel = ({ t, app }) => {
  const label = app.label || 'C' // default label
  const appName = t(`apps.${app.slug}.name`, { _: app.name || app.slug })
  return (
    <div>
      <div className="sto-transparency-label-wrapper">
        <div className="sto-transparency-label">
          <Caption>{t('label.legend.low_level')}</Caption>
          <img
            className="sto-transparency-label-image"
            src={labelImages[label]}
          />
          <Caption>{t('label.legend.high_level')}</Caption>
          <ReactMarkdownWrapper
            className="sto-transparency-label-desc"
            source={t(`label.${label}.description`)}
          />
        </div>
      </div>
      <Accordion>
        <AccordionItem label={t('app_modal.install.accordions.title1')}>
          <ReactMarkdownWrapper
            source={t(`label.${label}.details`, {
              appName,
              vendorLink: app.vendorLink
            })}
          />
        </AccordionItem>
        <AccordionItem label={t('app_modal.install.accordions.title2')}>
          <PermissionsList app={app} />
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default translate()(TransparencyLabel)
