import { transformData } from 'ducks/AlternativeStore/transformData'
import { AltStoreSourceShortcut } from 'ducks/AlternativeStore/types'
import AltStoreConfig from 'ducks/AlternativeStore/fixtures/flag.json'

test('transformData categorizes files and flags installed correctly', () => {
  const data = [
    {
      id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Espaces/I-Paf.url',
      name: 'I-Paf'
    },
    {
      id: '01904ab2-20a9-7243-9972-df18c9c671d3',
      metadata: { type: 'info' },
      path: '/Settings/Home/Info/Gestion des dossiers publidoc.url',
      name: 'Gestion des dossiers publidoc'
    },
    {
      id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
      metadata: { type: 'triskell' },
      path: '/Settings/Home/Espaces/M@gistère.url',
      name: 'M@gistère'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89c',
      metadata: { type: 'info' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Triskell.url',
      name: 'Triskell'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89d',
      metadata: { type: 'other' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/OtherFile.url',
      name: 'OtherFile'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89e',
      metadata: { type: 'link' },
      path: '/Settings/Home/Mes liens et raccourcis/Link.url',
      name: 'Link'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89f',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Foobar/Random.url',
      name: 'Random'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c890',
      metadata: {},
      path: '/Settings/Home/Info/NoType.url',
      name: 'NoType'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c891',
      metadata: { type: undefined },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/UndefinedType.url',
      name: 'UndefinedType'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c892',
      metadata: { type: 'unknown' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Unknown.url',
      name: 'Unknown'
    }
  ] as AltStoreSourceShortcut[] // Cast data to ToutaticeSourceShortcut[]

  const config = AltStoreConfig

  const expected = [
    {
      id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Espaces/I-Paf.url',
      installed: true,
      categories: ['espaces'],
      slug: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
      name: 'I-Paf'
    },
    {
      id: '01904ab2-20a9-7243-9972-df18c9c671d3',
      metadata: { type: 'info' },
      path: '/Settings/Home/Info/Gestion des dossiers publidoc.url',
      installed: true,
      categories: ['info'],
      slug: '01904ab2-20a9-7243-9972-df18c9c671d3',
      name: 'Gestion des dossiers publidoc'
    },
    {
      id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
      metadata: { type: 'triskell' },
      path: '/Settings/Home/Espaces/M@gistère.url',
      installed: true,
      categories: ['espaces'],
      slug: '01904ab2-2633-7243-9774-dc81fb0bc46a',
      name: 'M@gistère'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89c',
      metadata: { type: 'info' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Triskell.url',
      installed: false,
      categories: ['info'],
      slug: '01908039-3b2c-7852-b4bd-1d768199c89c',
      name: 'Triskell'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89d',
      metadata: { type: 'other' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/OtherFile.url',
      installed: false,
      categories: ['alternativeStore'],
      slug: '01908039-3b2c-7852-b4bd-1d768199c89d',
      name: 'OtherFile'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89e',
      metadata: { type: 'link' },
      path: '/Settings/Home/Mes liens et raccourcis/Link.url',
      installed: true,
      categories: ['alternativeStore'],
      name: 'Link',
      slug: '01908039-3b2c-7852-b4bd-1d768199c89e'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89f',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Foobar/Random.url',
      installed: true,
      categories: ['alternativeStore'],
      name: 'Random',
      slug: '01908039-3b2c-7852-b4bd-1d768199c89f'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c890',
      metadata: {},
      path: '/Settings/Home/Info/NoType.url',
      installed: true,
      categories: ['info'],
      name: 'NoType',
      slug: '01908039-3b2c-7852-b4bd-1d768199c890'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c891',
      metadata: { type: undefined },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/UndefinedType.url',
      installed: false,
      categories: ['alternativeStore'],
      name: 'UndefinedType',
      slug: '01908039-3b2c-7852-b4bd-1d768199c891'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c892',
      metadata: { type: 'unknown' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Unknown.url',
      installed: false,
      categories: ['alternativeStore'],
      name: 'Unknown',
      slug: '01908039-3b2c-7852-b4bd-1d768199c892'
    }
  ]

  const result = transformData(data, config)

  expect(result).toEqual(expected)
})
