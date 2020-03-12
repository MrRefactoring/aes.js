export namespace Helpers {
  export const generateSbox = (): number[] => {
    const p = parseInt(eval('1 + x + x**3 + x**4 + x**8'.replace(/x/g, '10')), 2);

    const t = new Uint32Array(256);
    const sbox = new Uint32Array(256);

    sbox[0] = 0x63;

    for (let i = 0, x = 1; i < 256; i++) {
      t[i] = x;
      x ^= (x << 1) ^ ((x >>> 7) * p);
    }

    for (let i = 0; i < 255; i++) {
      let x = t[255 - i];
      x |= x << 8;
      x ^= (x >> 4) ^ (x >> 5) ^ (x >> 6) ^ (x >> 7);
      sbox[t[i]] = (x ^ 0x63) & 0xFF;
    }

    return Array.from(sbox);
  }

  export const generateInvertedSbox = (sbox?: number[]): number[] => {
    sbox = sbox || generateSbox();

    const invSbox = new Uint32Array(256);

    for (let i = 0; i < 256; i++) {
      invSbox[i] = sbox.indexOf(i);
    }

    return Array.from(invSbox);
  }

  export const generateXTime = () => {
    const xtime = new Array(256);

    for (let i = 0; i < 128; i++) {
      xtime[i] = i << 1;
      xtime[128 + i] = (i << 1) ^ 0x1b;
    }

    return xtime;
  };
}

export * from './chunkDivider';
