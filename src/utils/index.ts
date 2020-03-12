import * as crypto from 'crypto';
import { bytes } from '..';

export namespace AESUtils {
  export const generateKey = (size: 128 | 192 | 256 = 128): bytes => {
    return [...crypto.randomBytes(size / 8)];
  };
}
