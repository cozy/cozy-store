import { FileMetadata, IOCozyFile } from 'cozy-client/types/types'

// Define enums for types and categories
export enum ShortcutType {
  Info = 'info',
  Triskell = 'triskell',
  Perso = 'perso'
}

export enum ShortcutCategory {
  ApplicationsToutatice = 'alternativeStore',
  Espaces = 'espaces',
  Info = 'info'
}

// Define the source shortcut interface
export interface ToutaticeSourceShortcut extends IOCozyFile {
  metadata: FileMetadata & {
    type?: ShortcutType | string
  }
  path?: string
}

// Define the shortcut interface with category inferred from type
export interface ToutaticeShortcut extends ToutaticeSourceShortcut {
  installed: boolean
}

// Define flag interface
export interface ToutaticeFlag {
  store: string
  categories: {
    [ShortcutCategory.ApplicationsToutatice]: string
    [ShortcutCategory.Espaces]: string
    [ShortcutCategory.Info]: string
  }
}

// Define categories interface
export interface ToutaticeCategories {
  [ShortcutCategory.ApplicationsToutatice]: ToutaticeShortcut[]
  [ShortcutCategory.Espaces]: ToutaticeShortcut[]
  [ShortcutCategory.Info]: ToutaticeShortcut[]
}
