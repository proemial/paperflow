
export function splitIntoBuckets(inputArray: string[], bucketSize: number): string[][] {
  const buckets: string[][] = [];
  for (let i = 0; i < inputArray.length; i += bucketSize) {
    const bucket: string[] = inputArray.slice(i, i + bucketSize);
    buckets.push(bucket);
  }
  return buckets;
}
