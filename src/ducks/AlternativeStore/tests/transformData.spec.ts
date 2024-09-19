import AlternativeStoreConfig from 'ducks/AlternativeStore/fixtures/flag.json'
import { transformData } from 'ducks/AlternativeStore/transformData'
import { AlternativeShortcut } from 'ducks/AlternativeStore/types'

describe('transformData', () => {
  test('categorizes files correctly based on metadata category and path', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        metadata: {
          target: {
            category: 'perso',
            description: 'Description for I-Paf'
          },
          externalDataSource: {
            source: 'Developer A'
          }
        },
        path: '/Settings/Home/Barfoo/I-Paf.url',
        name: 'I-Paf'
      },
      {
        id: '01904ab2-20a9-7243-9972-df18c9c671d3',
        metadata: {
          target: {
            category: 'foobaz',
            description: 'Description for Gestion des dossiers publidoc'
          },
          externalDataSource: {
            source: 'Developer B'
          }
        },
        path: '/Settings/Home/Foobaz/Gestion des dossiers publidoc.url',
        name: 'Gestion des dossiers publidoc'
      },
      {
        id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        metadata: {
          target: {
            category: 'quxbaz',
            description: 'Description for M@gistère'
          },
          externalDataSource: {
            source: 'Developer C'
          }
        },
        path: '/Settings/Home/Barfoo/M@gistère.url',
        name: 'M@gistère'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        metadata: {
          target: {
            category: 'perso',
            description: 'Description for I-Paf'
          },
          externalDataSource: {
            source: 'Developer A'
          }
        },
        path: '/Settings/Home/Barfoo/I-Paf.url',
        installed: true,
        categories: ['barfoo'],
        slug: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        name: 'I-Paf',
        long_description: 'Description for I-Paf',
        developer: { name: 'Developer A' }
      },
      {
        id: '01904ab2-20a9-7243-9972-df18c9c671d3',
        metadata: {
          target: {
            category: 'foobaz',
            description: 'Description for Gestion des dossiers publidoc'
          },
          externalDataSource: {
            source: 'Developer B'
          }
        },
        path: '/Settings/Home/Foobaz/Gestion des dossiers publidoc.url',
        installed: true,
        categories: ['foobaz'],
        slug: '01904ab2-20a9-7243-9972-df18c9c671d3',
        name: 'Gestion des dossiers publidoc',
        long_description: 'Description for Gestion des dossiers publidoc',
        developer: { name: 'Developer B' }
      },
      {
        id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        metadata: {
          target: {
            category: 'quxbaz',
            description: 'Description for M@gistère'
          },
          externalDataSource: {
            source: 'Developer C'
          }
        },
        path: '/Settings/Home/Barfoo/M@gistère.url',
        installed: true,
        categories: ['barfoo'],
        slug: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        name: 'M@gistère',
        long_description: 'Description for M@gistère',
        developer: { name: 'Developer C' }
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('flags files as not installed if they are in the store path', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: {
          target: {
            category: 'foobaz',
            description: 'Description for quxbaz'
          },
          externalDataSource: {
            source: 'Developer D'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        name: 'quxbaz'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89d',
        metadata: {
          target: {
            category: 'other',
            description: 'Description for OtherFile'
          },
          externalDataSource: {
            source: 'Developer E'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/OtherFile.url',
        name: 'OtherFile'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: {
          target: {
            category: 'foobaz',
            description: 'Description for quxbaz'
          },
          externalDataSource: {
            source: 'Developer D'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        installed: false,
        categories: ['foobaz'],
        slug: '01908039-3b2c-7852-b4bd-1d768199c89c',
        name: 'quxbaz',
        long_description: 'Description for quxbaz',
        developer: { name: 'Developer D' }
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89d',
        metadata: {
          target: {
            category: 'other',
            description: 'Description for OtherFile'
          },
          externalDataSource: {
            source: 'Developer E'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/OtherFile.url',
        installed: false,
        categories: ['alternativeStore'],
        slug: '01908039-3b2c-7852-b4bd-1d768199c89d',
        name: 'OtherFile',
        long_description: 'Description for OtherFile',
        developer: { name: 'Developer E' }
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('handles files with no metadata category or undefined category', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {
          target: {
            description: 'Description for NoCategory'
          },
          externalDataSource: {
            source: 'Developer F'
          }
        },
        path: '/Settings/Home/Foobaz/NoCategory.url',
        name: 'NoCategory'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c891',
        metadata: {
          target: {
            category: undefined,
            description: 'Description for UndefinedCategory'
          },
          externalDataSource: {
            source: 'Developer G'
          }
        },
        path:
          '/Settings/Home/Applications Foobar/Store Foobar/UndefinedCategory.url',
        name: 'UndefinedCategory'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {
          target: {
            description: 'Description for NoCategory'
          },
          externalDataSource: {
            source: 'Developer F'
          }
        },
        path: '/Settings/Home/Foobaz/NoCategory.url',
        installed: true,
        categories: ['alternativeStore'],
        name: 'NoCategory',
        slug: '01908039-3b2c-7852-b4bd-1d768199c890',
        long_description: 'Description for NoCategory',
        developer: { name: 'Developer F' }
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c891',
        metadata: {
          target: {
            category: undefined,
            description: 'Description for UndefinedCategory'
          },
          externalDataSource: {
            source: 'Developer G'
          }
        },
        path:
          '/Settings/Home/Applications Foobar/Store Foobar/UndefinedCategory.url',
        installed: false,
        categories: ['alternativeStore'],
        name: 'UndefinedCategory',
        slug: '01908039-3b2c-7852-b4bd-1d768199c891',
        long_description: 'Description for UndefinedCategory',
        developer: { name: 'Developer G' }
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('filters out files with paths not matching any configured paths', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: {
          target: {
            category: 'unknown',
            description: 'Description for Unknown'
          },
          externalDataSource: {
            source: 'Developer H'
          }
        },
        path: '/ultra/bogus/path',
        name: 'Unknown'
      }
    ] as AlternativeShortcut[]

    const expected: AlternativeShortcut[] = []

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('transforms a variety of files as expected', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: {
          target: {
            category: 'foobaz',
            description: 'Description for quxbaz'
          },
          externalDataSource: {
            source: 'Developer I'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        name: 'quxbaz'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {
          target: {
            description: 'Description for NoType'
          },
          externalDataSource: {
            source: 'Developer J'
          }
        },
        path: '/Settings/Home/Foobaz/NoType.url',
        name: 'NoType'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: {
          target: {
            category: 'unknown',
            description: 'Description for Unknown'
          },
          externalDataSource: {
            source: 'Developer K'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/Unknown.url',
        name: 'Unknown'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: {
          target: {
            category: 'foobaz',
            description: 'Description for quxbaz'
          },
          externalDataSource: {
            source: 'Developer I'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        installed: false,
        categories: ['foobaz'],
        slug: '01908039-3b2c-7852-b4bd-1d768199c89c',
        name: 'quxbaz',
        long_description: 'Description for quxbaz',
        developer: { name: 'Developer I' }
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {
          target: {
            description: 'Description for NoType'
          },
          externalDataSource: {
            source: 'Developer J'
          }
        },
        path: '/Settings/Home/Foobaz/NoType.url',
        installed: true,
        categories: ['alternativeStore'],
        name: 'NoType',
        slug: '01908039-3b2c-7852-b4bd-1d768199c890',
        long_description: 'Description for NoType',
        developer: { name: 'Developer J' }
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: {
          target: {
            category: 'unknown',
            description: 'Description for Unknown'
          },
          externalDataSource: {
            source: 'Developer K'
          }
        },
        path: '/Settings/Home/Applications Foobar/Store Foobar/Unknown.url',
        installed: false,
        categories: ['alternativeStore'],
        name: 'Unknown',
        slug: '01908039-3b2c-7852-b4bd-1d768199c892',
        long_description: 'Description for Unknown',
        developer: { name: 'Developer K' }
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })
})
