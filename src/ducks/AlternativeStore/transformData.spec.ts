import { transformData } from 'ducks/AlternativeStore/transformData'
import {
  ShortcutCategory,
  ToutaticeSourceShortcut
} from 'ducks/AlternativeStore/types'

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
  ] as ToutaticeSourceShortcut[] // Cast data to ToutaticeSourceShortcut[]

  const config = {
    store: '/Settings/Home/Applications Toutatice/Store Toutatice',
    categories: {
      [ShortcutCategory.ApplicationsToutatice]:
        '/Settings/Home/Applications Toutatice',
      [ShortcutCategory.Espaces]: '/Settings/Home/Espaces',
      [ShortcutCategory.Info]: '/Settings/Home/Info'
    }
  }

  const expected = {
    [ShortcutCategory.ApplicationsToutatice]: [
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89d',
        metadata: { type: 'other' },
        path: '/Settings/Home/Applications Toutatice/Store Toutatice/OtherFile.url',
        installed: false
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c891',
        metadata: { type: undefined },
        path: '/Settings/Home/Applications Toutatice/Store Toutatice/UndefinedType.url',
        installed: false
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c892',
        metadata: { type: 'unknown' },
        path: '/Settings/Home/Applications Toutatice/Store Toutatice/Unknown.url',
        installed: false
      }
    ],
    [ShortcutCategory.Info]: [
      {
        id: '01904ab2-20a9-7243-9972-df18c9c671d3',
        metadata: { type: 'info' },
        path: '/Settings/Home/Info/Gestion des dossiers publidoc.url',
        installed: true
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c89c',
        metadata: { type: 'info' },
        path: '/Settings/Home/Applications Toutatice/Store Toutatice/Triskell.url',
        installed: false
      },
      {
        id: '01908039-3b2c-7852-b4bd-1d768199c890',
        metadata: {},
        path: '/Settings/Home/Info/NoType.url',
        installed: true
      }
    ],
    [ShortcutCategory.Espaces]: [
      {
        id: '01904ab1-f1fd-7243-b39b-37fe73b5579a',
        installed: true,
        metadata: {
          type: 'perso'
        },
        path: '/Settings/Home/Espaces/I-Paf.url'
      },
      {
        id: '01904ab2-2633-7243-9774-dc81fb0bc46a',
        metadata: { type: 'triskell' },
        path: '/Settings/Home/Espaces/M@gistère.url',
        installed: true
      }
    ]
  }

  const result = transformData(data, config)
  expect(result).toEqual(expected)
})
