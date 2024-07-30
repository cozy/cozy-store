import {
  AltStoreConfig,
  AltStoreSourceShortcut
} from 'ducks/AlternativeStore/types'

export const transformData = (
  data: AltStoreSourceShortcut[],
  config: AltStoreConfig
): AltStoreSourceShortcut[] => {
  const categoryPathMap: { [key: string]: string } = {}
  for (const [key, path] of Object.entries(config.categories)) {
    categoryPathMap[path] = key
  }

  const fileTypeMappings: { [key: string]: string } = {}
  for (const [fileType, categoryName] of Object.entries(
    config.fileTypeMappings
  )) {
    fileTypeMappings[fileType] = categoryName
  }

  return data.map(file => {
    const metadataType = file.metadata.type || 'default' // Handle undefined type
    const filePath = file.path

    if (!filePath) return file

    const isStorePath = filePath.startsWith(config.store)
    let category: string | undefined

    // Determine category based on store path and metadata type first
    if (isStorePath) {
      // Use fileTypeMappings to determine category based on metadata type
      category = fileTypeMappings[metadataType] || fileTypeMappings['default']
    } else {
      // Determine category based on file path
      for (const [path, cat] of Object.entries(categoryPathMap)) {
        if (filePath.startsWith(path)) {
          category = cat
          break
        }
      }
      // If no category found based on path, use the default category
      if (!category) {
        category = fileTypeMappings['default']
      }
    }

    return {
      ...file,
      installed: !isStorePath,
      categories: [category],
      type: 'webapp',
      slug: file.id,
      name: file.name.replace('.url', '')
    }
  })
}
