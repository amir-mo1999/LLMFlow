export function splitArrayIntoChunks(array: Array<any>, chunkSize: number) {
  const result: Array<Array<any>> = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}
