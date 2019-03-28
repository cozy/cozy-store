export const RegistryAppsResponse = {
  data: [
    // collect should not be displayed by the store, see config/apps
    {
      slug: 'collect',
      type: 'webapp',
      editor: 'Cozy',
      label: 1,
      versions: {
        stable: ['3.0.0'],
        beta: ['3.0.0'],
        dev: ['3.0.0']
      },
      latest_version: {
        slug: 'collect',
        editor: 'Cozy',
        type: 'webapp',
        version: '3.0.0',
        manifest: {
          slug: 'collect',
          name: 'Collect',
          editor: 'Cozy',
          version: '3.0.0',
          name_prefix: 'Cozy',
          categories: ['cozy'],
          developer: { name: 'Cozy' },
          type: 'webapp',
          icon: '<svg></svg>',
          permissions: {
            mock: {
              type: 'io.mock.doctype'
            },
            mock2: {
              type: 'io.mock.doctype2'
            }
          },
          tags: ['konnector', 'collect', 'bills', 'providers', 'files']
        }
      }
    },
    // no stable and beta versions here
    {
      slug: 'devonly',
      editor: 'Cozy',
      type: 'webapp',
      label: 3,
      versions: {
        stable: [],
        beta: [],
        dev: ['1.0.0-betaojdkehy989ekhflldh']
      },
      latest_version: {
        slug: 'devonly',
        editor: 'Cozy',
        type: 'webapp',
        version: '1.0.0-betaojdkehy989ekhflldh',
        manifest: {
          slug: 'devonly',
          name: 'DevOnly',
          version: '1.0.0-betaojdkehy989ekhflldh',
          editor: 'Cozy',
          categories: ['otherssssss'],
          developer: { name: 'Cozy' },
          type: 'webapp',
          locales: {
            name: 'For Dev Only'
          },
          icon: '<svg></svg>'
        }
      }
    },
    {
      slug: 'konnector-bouilligue',
      editor: 'Cozy',
      type: 'konnector',
      label: 2,
      versions: {
        stable: ['0.1.0'],
        beta: ['0.1.0'],
        dev: ['0.1.0']
      },
      latest_version: {
        slug: 'konnector-bouilligue',
        type: 'konnector',
        editor: 'Cozy',
        version: '0.1.0',
        manifest: {
          slug: 'konnector-bouilligue',
          name: 'Bouilligue',
          icon: '<svg></svg>',
          developer: { name: 'Cozy' },
          type: 'konnector',
          categories: ['isp', 'telecom']
        }
      }
    },
    {
      slug: 'konnector-trinlane',
      editor: 'Blibli',
      type: 'konnector',
      label: 1,
      versions: {
        stable: ['0.1.0'],
        beta: ['0.1.0'],
        dev: ['0.1.0']
      },
      latest_version: {
        slug: 'konnector-trinlane',
        editor: 'Blibli',
        type: 'konnector',
        version: '0.1.0',
        manifest: {
          slug: 'konnector-trinlane',
          name: 'Trinlane',
          icon: '<svg></svg>',
          developer: { name: 'Cozy' },
          type: 'konnector',
          categories: ['transport'],
          tags: ['transport', 'files', 'bills'],
          permissions: {
            mock: {
              type: 'io.mock.doctype'
            }
          },
          version: '0.1.0'
        }
      }
    },
    {
      slug: 'photos',
      type: 'webapp',
      editor: 'Cozy',
      label: 1,
      versions: {
        stable: ['3.0.0'],
        beta: ['3.0.0'],
        dev: ['3.0.0']
      },
      latest_version: {
        slug: 'photos',
        editor: 'Cozy',
        version: '3.0.0',
        type: 'webapp',
        manifest: {
          slug: 'photos',
          name: 'Photos',
          editor: 'Cozy',
          name_prefix: 'Cozy',
          categories: ['cozy'],
          developer: { name: 'Cozy' },
          type: 'webapp',
          icon: '<svg></svg>',
          locales: {
            en: {
              long_description: 'A long description finally short'
            }
          }
        }
      }
    },
    {
      slug: 'tasky',
      type: 'webapp',
      editor: 'vestrejail',
      label: 4,
      versions: {
        stable: ['1.0.0'],
        beta: ['1.0.0'],
        dev: ['1.0.0']
      },
      latest_version: {
        slug: 'tasky',
        type: 'webapp',
        editor: 'vestrejail',
        version: '1.0.0',
        manifest: {
          slug: 'tasky',
          name: 'Tasky',
          categories: ['partners'],
          icon: '<svg></svg>',
          editor: 'vestrejail',
          version: '1.0.0',
          type: 'webapp'
        }
      }
    }
  ]
}

export default RegistryAppsResponse
