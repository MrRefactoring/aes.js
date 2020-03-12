import { bytes } from '..';

export const chunkDivider = (array: bytes, chunkSize: number): bytes[] => {
  const chunks = [];

  for (let i = 0; i < array.length; i += (chunkSize - 1)) {
    chunks.push([15, ...array.slice(i, i + chunkSize - 1)]);
  }

  const lastChunk = chunks[chunks.length - 1];

  chunks[chunks.length - 1] = [lastChunk.length - 1, ...lastChunk.slice(1), ...Array(chunkSize - lastChunk.length).fill(0)]

  return chunks;
};
