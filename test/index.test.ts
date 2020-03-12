import * as fs from 'fs';
import { promisify } from 'util';
import { AES, AESUtils } from '../src';

const readFile = promisify(fs.readFile);

describe('AES test cases', () => {
  it('should creates new instance', () => {
    const aes = new AES(AESUtils.generateKey());

    expect(aes).toBeDefined();
  });

  it('should encrypt calls', () => {
    const aes = new AES(AESUtils.generateKey());

    const message = AESUtils.generateKey();

    const encodedMessage = aes.encrypt(message);

    expect(encodedMessage).toBeDefined();
    expect(Array.isArray(encodedMessage)).toBeTruthy();
  });

  it('should encrypt and decrypt case 1', () => {
    const aes = new AES(AESUtils.generateKey());

    const message = AESUtils.generateKey();

    const encodedMessage = aes.encrypt(message);
    const decodedMessage = aes.decrypt(encodedMessage);

    expect(decodedMessage).toEqual(message);
  });

  it('should encrypt and decrypt case 2', () => {
    const aes = new AES(AESUtils.generateKey());

    const message = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const encodedMessage = aes.encrypt(message);
    const decodedMessage = aes.decrypt(encodedMessage);

    expect(decodedMessage).toEqual(message);
  });

  it('should encrypt and decrypt TS file', async () => {
    const file = [...await readFile('test/mock.file.txt')];

    const aes = new AES(AESUtils.generateKey());

    const encryptedFile = aes.encrypt(file);
    const decryptedFile = aes.decrypt(encryptedFile);

    expect(decryptedFile).toEqual(file);
  });
});
