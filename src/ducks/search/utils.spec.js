import { fillIntervals } from './utils'

test('fillIntervals', () => {
  expect(
    fillIntervals(
      [
        [1, 2],
        [4, 5],
        [9, 12]
      ],
      15
    )
  ).toEqual([
    { idx: [0, 1], mark: false },
    { idx: [1, 2], mark: true },
    { idx: [2, 4], mark: false },
    { idx: [4, 5], mark: true },
    { idx: [5, 9], mark: false },
    { idx: [9, 12], mark: true },
    { idx: [12, 15], mark: false }
  ])
})
