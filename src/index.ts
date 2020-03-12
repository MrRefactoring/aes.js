import { Helpers, chunkDivider } from './helpers/index';

export type bytes = number[];

export class AES {
  private readonly signature: bytes;
  private sbox: number[];
  private xtime: number[];
  private invertedSBox: number[];
  private shiftRowTable: number[];
  private shiftRowTableInversed: number[];

  constructor(signature: bytes) {
    this.signature = signature;
    this.sbox = Helpers.generateSbox();
    this.xtime = Helpers.generateXTime();
    this.invertedSBox = Helpers.generateInvertedSbox();
    this.shiftRowTable = [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11];
    this.shiftRowTableInversed = [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3];
  }

  public encrypt(bytes: bytes): bytes {
    const blocks = chunkDivider(bytes, 16);

    return blocks
      .map(this.encryptBlock)
      // @ts-ignore
      .flat();
  }

  public decrypt(bytes: bytes): bytes {
    const blocks = [];

    for (let offset = 0; offset < bytes.length; offset += 16) {
      blocks.push(bytes.slice(offset, offset + 16));
    }

    return blocks
      .map(this.decryptBlock)
      // @ts-ignore
      .flat();
  }

  private encryptBlock = (block: bytes): bytes => {
    block = this.addRoundKey(block, this.signature.slice(0, 16));

    for (let offset = 16; offset < this.signature.length - 16; offset += 16) {
      const roundKey = this.signature.slice(offset, offset + 16);

      block = this.subbytes(block);
      block = this.shiftRows(block);
      block = this.mixColumns(block);
      block = this.addRoundKey(block, roundKey);
    }

    block = this.subbytes(block);
    block = this.shiftRows(block);
    block = this.addRoundKey(block, this.signature.slice(-16));

    return block;
  }

  private decryptBlock = (block: bytes): bytes => {
    block = this.addRoundKey(block, this.signature.slice(-16));
    block = this.shiftRowsInverse(block);
    block = this.subbytesInverse(block);

    for (let offset = this.signature.length - 32; offset >= 16; offset -= 16) {
      block = this.addRoundKey(block, this.signature.slice(offset, offset + 16));
      block = this.mixColumnsInverse(block);
      block = this.shiftRowsInverse(block);
      block = this.subbytesInverse(block);
    }

    block = this.addRoundKey(block, this.signature.slice(0, 16));

    const outputSize = block[0];

    return block.slice(1, outputSize);
  }

  private addRoundKey(state: bytes, roundKey: bytes): bytes {
    return state.map((element, index) => element ^ roundKey[index]);
  }

  private subbytes(state: bytes): bytes {
    return state.map((element) => this.sbox[element]);
  }

  private subbytesInverse(state: bytes): bytes {
    return state.map((element) => this.invertedSBox[element]);
  }

  private shiftRows(state: bytes): bytes {
    return state.map((_, index) => state[this.shiftRowTable[index]]);
  }

  private shiftRowsInverse(state: bytes): bytes {
    return state.map((_, index) => state[this.shiftRowTableInversed[index]]);
  }

  private mixColumns(state: bytes): bytes {
    for (let offset = 0; offset < state.length; offset += 4) {
      const s0 = state[offset];
      const s1 = state[offset + 1];
      const s2 = state[offset + 2];
      const s3 = state[offset + 3];

      const h = s0 ^ s1 ^ s2 ^ s3;

      state[offset + 0] ^= h ^ this.xtime[s0 ^ s1];
      state[offset + 1] ^= h ^ this.xtime[s1 ^ s2];
      state[offset + 2] ^= h ^ this.xtime[s2 ^ s3];
      state[offset + 3] ^= h ^ this.xtime[s3 ^ s0];
    }

    return state;
  }

  private mixColumnsInverse(state: bytes): bytes {
    for (let offset = 0; offset < 16; offset += 4) {
      const s0 = state[offset + 0];
      const s1 = state[offset + 1];
      const s2 = state[offset + 2];
      const s3 = state[offset + 3];

      const h = s0 ^ s1 ^ s2 ^ s3;

      const xh = this.xtime[h];

      const h1 = this.xtime[this.xtime[xh ^ s0 ^ s2]] ^ h;
      const h2 = this.xtime[this.xtime[xh ^ s1 ^ s3]] ^ h;

      state[offset + 0] ^= h1 ^ this.xtime[s0 ^ s1];
      state[offset + 1] ^= h2 ^ this.xtime[s1 ^ s2];
      state[offset + 2] ^= h1 ^ this.xtime[s2 ^ s3];
      state[offset + 3] ^= h2 ^ this.xtime[s3 ^ s0];
    }

    return state;
  }
}

export * from './utils/index';
