import {
  ToutaticeFlag,
  ToutaticeSourceShortcut,
  ShortcutType,
  ShortcutCategory
} from 'ducks/AlternativeStore/types'

export const transformData = (
  data: ToutaticeSourceShortcut[],
  config: ToutaticeFlag
): ToutaticeSourceShortcut[] => {
  const categoryPathMap: { [key: string]: ShortcutCategory } = {
    [config.categories['Applications Toutatice']]:
      ShortcutCategory.ApplicationsToutatice,
    [config.categories['Espaces']]: ShortcutCategory.Espaces,
    [config.categories['Info']]: ShortcutCategory.Info
  }

  return data.map(file => {
    const metadataType = file.metadata.type as ShortcutType | undefined
    const filePath = file.path

    if (!filePath) return file

    const isStorePath = filePath.startsWith(config.store)
    let category: ShortcutCategory | undefined

    // Determine category based on store path and metadata type first
    if (isStorePath) {
      if (metadataType === ShortcutType.Info) {
        category = ShortcutCategory.Info
      } else if (
        metadataType === ShortcutType.Triskell ||
        metadataType === ShortcutType.Perso
      ) {
        category = ShortcutCategory.Espaces
      } else {
        category = ShortcutCategory.ApplicationsToutatice
      }
    } else {
      // Determine category based on file path
      for (const [path, cat] of Object.entries(categoryPathMap)) {
        if (filePath.startsWith(path)) {
          category = cat
          break
        }
      }
    }

    // Default to Applications Toutatice if no category is found
    if (!category) {
      category = ShortcutCategory.ApplicationsToutatice
    }

    return {
      ...file,
      installed: !isStorePath,
      categories: [category],
      type: 'webapp'
    }
  })
}
