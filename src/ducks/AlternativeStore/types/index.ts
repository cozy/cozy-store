import { IOCozyFile } from 'cozy-client/types/types'

export interface AlternativeStoreConfig {
  store: string
  categories: Record<string, string>
  fileTypeMappings: Record<string, string>
}

export interface AlternativeShortcut extends IOCozyFile {
  installed?: boolean
  long_description?: string
  developer?: {
    name?: string
  }
}
