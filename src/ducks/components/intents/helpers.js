export const isPermissionsPageToDisplay = data => {
  const { pageToDisplay, category } = data || {}
  return !category && (!pageToDisplay || pageToDisplay === 'permissions')
}
