export const Bank = {
  editor: 'Cozy',
  id: 'boursorama',
  langs: ['en'],
  partnership: {
    domain: 'budget-insight.com',
    name: 'Budget Insight'
  },
  permissions: {
    accounts: {
      description: 'This should be replaced by permissions.banking translation',
      type: 'io.cozy.accounts'
    },
    bank_accounts: {
      description: 'This is an internal doctype',
      type: 'io.cozy.bank.accounts'
    },
    auto_categorization: {
      description: 'This is a remote doctype',
      type: 'cc.cozycloud.autocategorization'
    },
    dacc: {
      description: 'This is another remote doctype',
      type: 'cc.cozycloud.dacc'
    },
    settings: {
      description:
        "Required to read user's mail and configure a Budget Insight account",
      type: 'io.cozy.settings',
      verbs: ['GET']
    }
  },
  slug: 'boursorama83',
  type: 'konnector'
}

export default Bank
