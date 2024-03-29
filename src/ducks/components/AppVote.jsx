import voteIllustration from 'assets/icons/app-vote.svg'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import PopupOpener from 'cozy-ui/transpiled/react/PopupOpener'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

const VOTING_LINK =
  'https://portal.productboard.com/apgt1jwdsjitcdcz888fbjxt/tabs/5-wish-list'

export const AppVote = ({ t }) => (
  <PopupOpener
    url={VOTING_LINK}
    title="Cozy app voting"
    height={700}
    width={650}
    className="sto-app-vote-wrapper"
  >
    <div className="sto-app-vote">
      <Icon
        icon={voteIllustration}
        height="60"
        width="55"
        className="sto-app-vote-icon"
      />
      <strong>
        <p>{t('app_vote.line1')}</p>
        <p>{t('app_vote.line2')}</p>
      </strong>
    </div>
  </PopupOpener>
)

export default translate()(AppVote)
