export const KonnectorTrinlane = {
  slug: 'konnector-trinlane',
  editor: 'Cozy',
  type: 'konnector',
  version: '0.1.0',
  manifest: {
    name: 'Trinlane',
    slug: 'konnector-trinlane',
    icon: 'https://mockcozy.cc/registry/konnector-trinlane/0.1.0/icon.svg',
    short_description: 'A konnector for trinlane',
    source: 'https://github.com/cozy/cozy-konnector-trinlane.git@build',
    editor: 'Cozy',
    vendorLink: 'www.trinlane.fr',
    type: 'konnector',
    categories: ['transport'],
    fields: {
      login: {
        type: 'text'
      },
      password: {
        type: 'password'
      },
      advancedFields: {
        folderPath: {
          advanced: true,
          isRequired: false
        }
      }
    },
    dataType: [
      'bill'
    ],
    permissions: {
      'bank operations': {
        description: 'Required to link bills to bank operations',
        type: 'io.cozy.bank.operations'
      },
      bills: {
        description: 'Required to save the bills data',
        type: 'io.cozy.bills'
      },
      files: {
        description: 'Required to save the bills',
        type: 'io.cozy.files'
      },
      accounts: {
        description: 'Required to get the account\'s data',
        type: 'io.cozy.accounts',
        verbs: ['GET']
      }
    },
    developer: {
      name: 'Cozy',
      url: 'https://cozy.io'
    },
    langs: ['fr', 'en'],
    locales: {
      fr: {
        description: 'Récupère toutes vos factures Trainline',
        permissions: {
          'bank operations': {
            description: 'Utilisé pour lier vos factures à vos opérations banquaires'
          },
          bills: {
            description: 'Utilisé pour sauvegarder les données de facturation'
          },
          files: {
            description: 'Utilisé pour sauvegarder les factures'
          },
          accounts: {
            description: 'Utilisé pour obtenir les données du compte'
          }
        }
      },
      en: {
        description: 'Fetch all your trainline bills',
        permissions: {
          'bank operations': {
            description: 'Required to link bills to bank operations'
          },
          bills: {
            description: 'Required to save the bills data'
          },
          files: {
            description: 'Required to save the bills'
          },
          accounts: {
            description: 'Required to get the account\'s data'
          }
        }
      }
    }
  }
}

export default KonnectorTrinlane
