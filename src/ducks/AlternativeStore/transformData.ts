import {
  ToutaticeCategories,
  ToutaticeFlag,
  ToutaticeSourceShortcut,
  ShortcutType,
  ShortcutCategory
} from 'ducks/AlternativeStore/types'

export const transformData = (
  data: ToutaticeSourceShortcut[],
  config: ToutaticeFlag
): ToutaticeCategories => {
  const result: ToutaticeCategories = {
    [ShortcutCategory.ApplicationsToutatice]: [],
    [ShortcutCategory.Info]: [],
    [ShortcutCategory.Espaces]: []
  }

  data.forEach(file => {
    const metadataType = file.metadata.type as ShortcutType | undefined
    const filePath = file.path

    if (!filePath) return

    const isStorePath = filePath.startsWith(config.store)

    const newFile = {
      ...file,
      installed: !isStorePath
    }

    if (
      filePath.startsWith(config.categories[ShortcutCategory.Info]) ||
      (isStorePath && metadataType === ShortcutType.Info)
    ) {
      result[ShortcutCategory.Info].push(newFile)
    } else if (
      filePath.startsWith(config.categories[ShortcutCategory.Espaces]) ||
      (isStorePath &&
        (metadataType === ShortcutType.Triskell ||
          metadataType === ShortcutType.Perso))
    ) {
      result[ShortcutCategory.Espaces].push(newFile)
    } else if (
      filePath.startsWith(
        config.categories[ShortcutCategory.ApplicationsToutatice]
      ) ||
      isStorePath
    ) {
      result[ShortcutCategory.ApplicationsToutatice].push(newFile)
    }
  })

  return result
}
