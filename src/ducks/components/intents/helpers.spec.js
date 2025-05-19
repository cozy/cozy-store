import { isPermissionsPageToDisplay } from '@/ducks/components/intents/helpers'

describe('isPermissionsPageToDisplay', () => {
  it.each`
    data                                                                                       | result
    ${undefined}                                                                               | ${true}
    ${{ pageToDisplay: undefined, category: undefined, qualificationLabels: undefined }}       | ${true}
    ${{ pageToDisplay: 'permissions', category: undefined, qualificationLabels: undefined }}   | ${true}
    ${{ pageToDisplay: undefined, category: 'energy', qualificationLabels: undefined }}        | ${false}
    ${{ pageToDisplay: 'details', category: 'energy', qualificationLabels: undefined }}        | ${false}
    ${{ pageToDisplay: 'permissions', category: 'energy', qualificationLabels: undefined }}    | ${false}
    ${{ pageToDisplay: undefined, category: undefined, qualificationLabels: 'pay_sheet' }}     | ${false}
    ${{ pageToDisplay: 'details', category: undefined, qualificationLabels: 'pay_sheet' }}     | ${false}
    ${{ pageToDisplay: 'permissions', category: undefined, qualificationLabels: 'pay_sheet' }} | ${false}
    ${{ pageToDisplay: undefined, category: 'energy', qualificationLabels: 'pay_sheet' }}      | ${false}
    ${{ pageToDisplay: 'details', category: 'energy', qualificationLabels: 'pay_sheet' }}      | ${false}
    ${{ pageToDisplay: 'permissions', category: 'energy', qualificationLabels: 'pay_sheet' }}  | ${false}
  `(`should return $result when passed param: $data`, ({ data, result }) => {
    expect(isPermissionsPageToDisplay(data)).toEqual(result)
  })
})
