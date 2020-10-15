/**
 * Given a list of intervals, will return all the intervals
 * along with the implicit intervals that are between the original
 * intervals. If the interval was in the original input, it will
 * be returned with { mark: true}, else if it is an implied
 * interval, it will be returned with { mark: false }.
 */
export const fillIntervals = (intervals, maxIndex) => {
  let cur = 0
  let res = []
  for (let idx of intervals) {
    if (idx[0] != cur) {
      res.push({ idx: [cur, idx[0]], mark: false })
    }
    res.push({ idx, mark: true })
    cur = idx[1]
  }
  if (cur != maxIndex) {
    res.push({ idx: [cur, maxIndex], mark: false })
  }

  return res
}

/** Dumps a fuse.js in the console and will highlight the part that matched */
export const dumpMatches = result => {
  for (let m of result.matches) {
    const allindices = fillIntervals(m.indices, m.value.length)
    // eslint-disable-next-line no-console
    console.log(
      allindices
        .map(o => {
          const [start, end] = o.idx
          const substr = m.value.substring(start, end)
          return o.mark ? `**${substr}**` : substr
        })
        .join('')
    )
  }
}
