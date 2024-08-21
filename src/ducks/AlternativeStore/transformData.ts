import {
  AlternativeShortcut,
  AlternativeStoreConfig
} from 'ducks/AlternativeStore/types'

import { IOCozyFile } from 'cozy-client/types/types'

export const transformData = (
  data: IOCozyFile[],
  config: AlternativeStoreConfig
): AlternativeShortcut[] => {
  const categoryPathMap: Record<string, string> = {}
  for (const [key, path] of Object.entries(config.categories)) {
    categoryPathMap[path] = key
  }

  const fileTypeMappings: Record<string, string> = {}
  for (const [fileType, categoryName] of Object.entries(
    config.fileTypeMappings
  )) {
    fileTypeMappings[fileType] = categoryName
  }

  return data
    .filter(file => {
      const filePath = file.path ?? ''
      const isStorePath = filePath.startsWith(config.store || '')
      const matchesCategoryPath = Object.keys(categoryPathMap).some(path =>
        filePath.startsWith(path)
      )

      // Filter out files that do not match any valid paths
      return isStorePath || matchesCategoryPath
    })
    .map(file => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metadataType = file.metadata.type ?? 'default'
      const filePath = file.path

      if (!filePath) return file

      const isStorePath = filePath.startsWith(config.store)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let category = fileTypeMappings[metadataType] || fileTypeMappings.default

      // If the file is not in the store path and no specific category was found based on metadata type,
      // determine the category based on the file path
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!isStorePath && !fileTypeMappings[metadataType]) {
        for (const [path, cat] of Object.entries(categoryPathMap)) {
          if (filePath.startsWith(path)) {
            category = cat
            break
          }
        }
      }

      return {
        ...file,
        name: file.name.replace('.url', ''),
        installed: !isStorePath,
        categories: [category],
        slug: file.id // This is much easier than refactoring the whole app
      }
    })
}
