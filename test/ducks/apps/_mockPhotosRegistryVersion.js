export const Photos = {
  slug: 'photos',
  editor: 'Cozy',
  type: 'webapp',
  version: '3.0.0',
  manifest: {
    name: 'Photos',
    slug: 'photos',
    short_description: 'Photos manager for Cozy v3',
    category: 'cozy',
    source: 'https://github.com/cozy/cozy-drive.git@build-photos',
    editor: 'Cozy',
    developer: {
      name: 'Cozy',
      url: 'https://cozy.io'
    },
    locales: {
      fr: {
        short_description: 'Gestionnaire de photos pour Cozy v3',
        long_description:
          '### Photos\n\nGestionnaire de photos pour Cozy v3 :tada:'
      },
      en: {
        short_description: 'Gestionnaire de photos pour Cozy v3',
        long_description:
          '### Features\n\nEnjoy features to grab your data in you Cozy :tada:',
        changes: '### NEW!!!\n\n Now on the cozy-store :tada'
      }
    },
    langs: ['en', 'fr'],
    platforms: [
      {
        type: 'ios',
        url: ''
      },
      {
        type: 'linux',
        url: ''
      },
      {
        type: 'android',
        url: 'https://mock.app'
      }
    ],
    routes: {
      '/': {
        folder: '/',
        index: 'index.html',
        public: false
      },
      '/public': {
        folder: '/public',
        index: 'index.html',
        public: true
      }
    },
    version: '3.0.0',
    licence: 'AGPL-3.0',
    permissions: {
      files: {
        description: 'Required for photo access',
        type: 'io.cozy.files',
        methods: ['GET', 'POST', 'PUT']
      },
      apps: {
        description:
          'Required by the cozy-bar to display the icons of the apps',
        type: 'io.cozy.apps',
        verbs: ['GET']
      },
      albums: {
        description: 'Required to manage photos albums',
        type: 'io.cozy.photos.albums',
        methods: ['GET', 'POST', 'PUT']
      },
      contacts: {
        description: 'Required to to share photos with your contacts',
        type: 'io.cozy.contacts',
        methods: ['GET', 'POST']
      },
      settings: {
        description:
          'Required by the cozy-bar to display Claudy and know which applications are coming soon',
        type: 'io.cozy.settings',
        verbs: ['GET']
      }
    }
  }
}

export default Photos
