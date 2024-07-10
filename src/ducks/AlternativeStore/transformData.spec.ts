import { transformData } from 'ducks/AlternativeStore/transformData'
import { AltStoreSourceShortcut } from 'ducks/AlternativeStore/types'
import AltStoreConfig from 'ducks/AlternativeStore/fixtures/flag.json'

test('transformData categorizes files and flags installed correctly', () => {
  const data = [
    {
      id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Espaces/I-Paf.url'
    },
    {
      id: '01904ab2-20a9-7243-9972-df18c9c671d3',
      metadata: { type: 'info' },
      path: '/Settings/Home/Info/Gestion des dossiers publidoc.url'
    },
    {
      id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
      metadata: { type: 'triskell' },
      path: '/Settings/Home/Espaces/M@gistère.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89c',
      metadata: { type: 'info' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Triskell.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89d',
      metadata: { type: 'other' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/OtherFile.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89e',
      metadata: { type: 'link' },
      path: '/Settings/Home/Mes liens et raccourcis/Link.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89f',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Foobar/Random.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c890',
      metadata: {},
      path: '/Settings/Home/Info/NoType.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c891',
      metadata: { type: undefined },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/UndefinedType.url'
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c892',
      metadata: { type: 'unknown' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Unknown.url'
    }
  ] as AltStoreSourceShortcut[] // Cast data to ToutaticeSourceShortcut[]

  const config = AltStoreConfig

  const expected = [
    {
      id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Espaces/I-Paf.url',
      installed: true,
      categories: ['espaces']
    },
    {
      id: '01904ab2-20a9-7243-9972-df18c9c671d3',
      metadata: { type: 'info' },
      path: '/Settings/Home/Info/Gestion des dossiers publidoc.url',
      installed: true,
      categories: ['info']
    },
    {
      id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
      metadata: { type: 'triskell' },
      path: '/Settings/Home/Espaces/M@gistère.url',
      installed: true,
      categories: ['espaces']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89c',
      metadata: { type: 'info' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Triskell.url',
      installed: false,
      categories: ['info']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89d',
      metadata: { type: 'other' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/OtherFile.url',
      installed: false,
      categories: ['applicationsToutatice']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89e',
      metadata: { type: 'link' },
      path: '/Settings/Home/Mes liens et raccourcis/Link.url',
      installed: true,
      categories: ['applicationsToutatice']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c89f',
      metadata: { type: 'perso' },
      path: '/Settings/Home/Foobar/Random.url',
      installed: true,
      categories: ['applicationsToutatice']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c890',
      metadata: {},
      path: '/Settings/Home/Info/NoType.url',
      installed: true,
      categories: ['info']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c891',
      metadata: { type: undefined },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/UndefinedType.url',
      installed: false,
      categories: ['applicationsToutatice']
    },
    {
      id: '01908039-3b2c-7852-b4bd-1d768199c892',
      metadata: { type: 'unknown' },
      path: '/Settings/Home/Applications Toutatice/Store Toutatice/Unknown.url',
      installed: false,
      categories: ['applicationsToutatice']
    }
  ]

  const result = transformData(data, config)

  expect(result).toEqual(expected)
})
