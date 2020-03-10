import { Helpers } from './helpers/index';

export type bytes = number[];

const roundsProjection = {
  128: 10,
  192: 12,
  256: 14,
};

export class AES {
  private readonly signature: bytes;
  private readonly rounds: number;
  private sbox: number[];
  private invertedSBox: number[];

  constructor(signature: bytes) {
    this.signature = signature;
    this.rounds = roundsProjection[signature.length];
    this.sbox = Helpers.generateSbox();
    this.invertedSBox = Helpers.generateInvertedSbox();
  }

  public encode(bytes: bytes): bytes {
    return undefined;
  }

  public decode(bytes: bytes): bytes {
    return undefined;
  }
}

export * from './utils/index';
