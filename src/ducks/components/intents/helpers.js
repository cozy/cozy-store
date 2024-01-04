export const isPermissionsPageToDisplay = data => {
  const { pageToDisplay, category, qualificationLabels } = data || {}
  return (
    !category &&
    !qualificationLabels &&
    (!pageToDisplay || pageToDisplay === 'permissions')
  )
}
