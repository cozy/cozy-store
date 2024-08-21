import AlternativeStoreConfig from 'ducks/AlternativeStore/fixtures/flag.json'
import { transformData } from 'ducks/AlternativeStore/transformData'
import { AlternativeShortcut } from 'ducks/AlternativeStore/types'

describe('transformData', () => {
  test('categorizes files correctly based on metadata type and path', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        metadata: { type: 'perso' },
        path: '/Settings/Home/Barfoo/I-Paf.url',
        name: 'I-Paf'
      },
      {
        id: '01904ab2-20a9-7243-9972-df18c9c671d3',
        metadata: { type: 'foobaz' },
        path: '/Settings/Home/Foobaz/Gestion des dossiers publidoc.url',
        name: 'Gestion des dossiers publidoc'
      },
      {
        id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        metadata: { type: 'quxbaz' },
        path: '/Settings/Home/Barfoo/M@gistère.url',
        name: 'M@gistère'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        metadata: { type: 'perso' },
        path: '/Settings/Home/Barfoo/I-Paf.url',
        installed: true,
        categories: ['barfoo'],
        slug: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        name: 'I-Paf'
      },
      {
        id: '01904ab2-20a9-7243-9972-df18c9c671d3',
        metadata: { type: 'foobaz' },
        path: '/Settings/Home/Foobaz/Gestion des dossiers publidoc.url',
        installed: true,
        categories: ['foobaz'],
        slug: '01904ab2-20a9-7243-9972-df18c9c671d3',
        name: 'Gestion des dossiers publidoc'
      },
      {
        id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        metadata: { type: 'quxbaz' },
        path: '/Settings/Home/Barfoo/M@gistère.url',
        installed: true,
        categories: ['barfoo'],
        slug: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        name: 'M@gistère'
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('flags files as not installed if they are in the store path', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: { type: 'foobaz' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        name: 'quxbaz'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89d',
        metadata: { type: 'other' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/OtherFile.url',
        name: 'OtherFile'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: { type: 'foobaz' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        installed: false,
        categories: ['foobaz'],
        slug: '01908039-3b2c-7852-b4bd-1d768199c89c',
        name: 'quxbaz'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89d',
        metadata: { type: 'other' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/OtherFile.url',
        installed: false,
        categories: ['alternativeStore'],
        slug: '01908039-3b2c-7852-b4bd-1d768199c89d',
        name: 'OtherFile'
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('handles files with no metadata type or undefined type', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {},
        path: '/Settings/Home/Foobaz/NoType.url',
        name: 'NoType'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c891',
        metadata: { type: undefined },
        path:
          '/Settings/Home/Applications Foobar/Store Foobar/UndefinedType.url',
        name: 'UndefinedType'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {},
        path: '/Settings/Home/Foobaz/NoType.url',
        installed: true,
        categories: ['alternativeStore'],
        name: 'NoType',
        slug: '01908039-3b2c-7852-b4bd-1d768199c890'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c891',
        metadata: { type: undefined },
        path:
          '/Settings/Home/Applications Foobar/Store Foobar/UndefinedType.url',
        installed: false,
        categories: ['alternativeStore'],
        name: 'UndefinedType',
        slug: '01908039-3b2c-7852-b4bd-1d768199c891'
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })

  test('filters out files with paths not matching any configured paths', () => {
    const data: AlternativeShortcut[] = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: { type: 'unknown' },
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
        metadata: { type: 'foobaz' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        name: 'quxbaz'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {},
        path: '/Settings/Home/Foobaz/NoType.url',
        name: 'NoType'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: { type: 'unknown' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/Unknown.url',
        name: 'Unknown'
      }
    ] as AlternativeShortcut[]

    const expected = [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: { type: 'foobaz' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/quxbaz.url',
        installed: false,
        categories: ['foobaz'],
        slug: '01908039-3b2c-7852-b4bd-1d768199c89c',
        name: 'quxbaz'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {},
        path: '/Settings/Home/Foobaz/NoType.url',
        installed: true,
        categories: ['alternativeStore'],
        name: 'NoType',
        slug: '01908039-3b2c-7852-b4bd-1d768199c890'
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: { type: 'unknown' },
        path: '/Settings/Home/Applications Foobar/Store Foobar/Unknown.url',
        installed: false,
        categories: ['alternativeStore'],
        name: 'Unknown',
        slug: '01908039-3b2c-7852-b4bd-1d768199c892'
      }
    ]

    const result = transformData(data, AlternativeStoreConfig)
    expect(result).toEqual(expected)
  })
})
