import { isPermissionsPageToDisplay } from 'ducks/components/intents/helpers'

describe('isPermissionsPageToDisplay', () => {
  it.each`
    data                                                     | result
    ${undefined}                                             | ${true}
    ${{ pageToDisplay: undefined, category: undefined }}     | ${true}
    ${{ pageToDisplay: 'permissions', category: undefined }} | ${true}
    ${{ pageToDisplay: undefined, category: 'energy' }}      | ${false}
    ${{ pageToDisplay: 'details', category: 'energy' }}      | ${false}
    ${{ pageToDisplay: 'permissions', category: 'energy' }}  | ${false}
  `(`should return $result when passed param: $data`, ({ data, result }) => {
    expect(isPermissionsPageToDisplay(data)).toEqual(result)
  })
})
