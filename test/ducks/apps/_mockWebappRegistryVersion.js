export const webapp = {
  categories: ['cozy'],
  developer: {
    name: 'Cozy Cloud',
    url: 'https://cozy.io'
  },
  editor: 'Cozy',
  icon: 'public/app-icon.svg',
  langs: ['en', 'fr'],
  licence: 'AGPL-3.0',
  locales: {},
  name: 'Photos',
  name_prefix: 'Cozy',
  permissions: {
    files: {
      type: 'io.cozy.files',
      description: 'Required for photo access',
      verbs: ['GET', 'POST', 'PUT', 'PATCH']
    },
    apps: {
      type: 'io.cozy.apps',
      description: 'Required by the cozy-bar to display the icons of the apps',
      verbs: ['GET', 'PUT']
    },
    albums: {
      type: 'io.cozy.photos.albums',
      description: 'Required to manage photos albums',
      verbs: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    photos_settings: {
      type: 'io.cozy.photos.settings',
      description: 'Required to manage photos albums settings',
      verbs: ['GET', 'POST', 'PUT']
    },
    contacts: {
      type: 'io.cozy.contacts',
      description: 'Required to to share photos with your contacts',
      verbs: ['GET', 'POST']
    },
    settings: {
      type: 'io.cozy.settings',
      description:
        'Required by the cozy-bar to display Claudy and know which applications are coming soon',
      verbs: ['GET']
    },
    oauth: {
      type: 'io.cozy.oauth.clients',
      description: 'Required to display the cozy-desktop banner',
      verbs: ['GET']
    },
    reporting: {
      type: 'cc.cozycloud.sentry',
      description: 'Allow to report unexpected errors to the support team',
      verbs: ['POST']
    },
    triggers: {
      type: 'io.cozy.triggers',
      description: 'Required to re-execute the clustering',
      verbs: ['POST'],
      selector: 'worker',
      values: ['service']
    }
  },
  routes: {},
  screenshots: [],
  services: {},
  slug: 'photos',
  type: 'webapp',
  version: '1.40.0',
  versions: {
    has_versions: true,
    stable: ['1.3.1']
  },
  label: 1,
  links: {},
  uninstallable: true,
  isInRegistry: true,
  installed: true,
  created_at: '2021-11-10T17:43:26.509411+01:00',
  intents: null,
  notifications: null,
  source: 'registry://photos/stable',
  state: 'ready',
  updated_at: '2022-04-27T15:12:59.482571+02:00',
  _id: 'io.cozy.apps/photos'
}
