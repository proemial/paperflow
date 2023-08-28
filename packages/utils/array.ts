
export function splitIntoBuckets<T>(inputArray: T[], bucketSize: number): T[][] {
  const buckets: T[][] = [];
  for (let i = 0; i < inputArray.length; i += bucketSize) {
    const bucket: T[] = inputArray.slice(i, i + bucketSize);
    buckets.push(bucket);
  }
  return buckets;
}

export function asChunks<T>(inputArray: T[], bucketSize: number): T[][] {
  return splitIntoBuckets(inputArray, bucketSize);
}

export function randomArrayEntry<T>(array: T[]): T {
  return array[~~(Math.random() * array.length)];
}
