export const isPermissionsPageToDisplay = data => {
  const { pageToDisplay, category, qualificationLabels, slugList } = data || {}
  return (
    !category &&
    !qualificationLabels &&
    !slugList &&
    (!pageToDisplay || pageToDisplay === 'permissions')
  )
}
