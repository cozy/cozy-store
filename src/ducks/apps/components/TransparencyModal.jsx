import React from 'react'
// import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'
import { Bold, Caption } from 'cozy-ui/react/Text'
import Label from 'cozy-ui/react/Label'
import Button from 'cozy-ui/react/Button'
import Icon from 'cozy-ui/react/Icon'
import Modal, { ModalHeader, ModalContent } from 'cozy-ui/react/Modal'
import ReactMarkdownWrapper, {
  reactMarkdownRendererOptions
} from 'ducks/components/ReactMarkdownWrapper'
import { withRouter } from 'react-router-dom'

import labelExplain from 'assets/label/_explain.svg'
import backIcon from 'assets/icons/icon-arrow-left.svg'

export const mdParseParagraphs = props => (
  <p className="sto-transparency-notice-text">{props.children}</p>
)

const mdOptions = Object.assign({}, reactMarkdownRendererOptions, {
  paragraph: mdParseParagraphs
})

export const LabelItem = ({ t, label }) => (
  <div className="sto-transparency-notice-label">
    <span className={`sto-transparency-notice-label-pin --${label}`} />
    <ReactMarkdownWrapper
      source={t(`label.notice.labels.${label}`)}
      renderersOptions={mdOptions}
    />
  </div>
)

export const TransparencyModal = ({ t, match, history }) => {
  const goBack = () => {
    history.replace(match.url)
  }
  return (
    <Modal
      className="sto-transparency-notice-modal"
      spacing="small"
      closable={false}
      mobileFullscreen
    >
      <ModalHeader className="sto-transparency-notice-header">
        <button onClick={goBack} tabIndex="1" className="sto-no-styles-button">
          <Icon icon={backIcon} width="24px" height="24px" />
        </button>
        <h2 className="u-title-h2">{t('label.notice.title')}</h2>
      </ModalHeader>
      <ModalContent className="sto-transparency-notice">
        <p className="sto-transparency-notice-desc">{t('label.notice.desc')}</p>
        <div className="sto-transparency-notice-illu">
          <Caption>{t('label.legend.low_level')}</Caption>
          <img className="sto-transparency-notice-image" src={labelExplain} />
          <Caption>{t('label.legend.high_level')}</Caption>
        </div>
        <Label className="sto-transparency-notice-definition">
          {t('label.notice.definition')}
        </Label>
        <Bold className="sto-transparency-notice-subtitle">
          {t('label.notice.subtitles.no_out')}
        </Bold>
        {['A', 'B', 'C'].map(label => (
          <LabelItem t={t} label={label} key={label} />
        ))}
        <Bold className="sto-transparency-notice-subtitle">
          {t('label.notice.subtitles.cozy')}
        </Bold>
        {['D'].map(label => (
          <LabelItem t={t} label={label} key={label} />
        ))}
        <Bold className="sto-transparency-notice-subtitle">
          {t('label.notice.subtitles.out')}
        </Bold>
        {['E', 'F'].map(label => (
          <LabelItem t={t} label={label} key={label} />
        ))}
        <Button
          subtle
          icon="openwith"
          href={t('label.notice.link')}
          label={t('label.notice.link_text')}
          className="sto-transparency-notice-more-button"
        />
      </ModalContent>
    </Modal>
  )
}

export default withRouter(translate()(TransparencyModal))
