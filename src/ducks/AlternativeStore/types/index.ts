import { FileMetadata, IOCozyFile } from 'cozy-client/types/types'

// Define the source shortcut interface
export interface AltStoreSourceShortcut extends IOCozyFile {
  metadata: FileMetadata & {
    type?: string
  }
  path?: string
}

// Define the shortcut interface with category inferred from type
export interface AltStoreShortcut extends AltStoreSourceShortcut {
  installed: boolean
}

// Define flag interface
export interface AltStoreConfig {
  store: string
  categories: {
    [key: string]: string // This allows for dynamic category keys
  }
  fileTypeMappings: {
    [fileType: string]: string // Map file types to category names
  }
}
