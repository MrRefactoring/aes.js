import { AES, AESUtils } from '../src';

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

  it('should encrypt and decrypt', () => {
    const aes = new AES(AESUtils.generateKey());

    const message = AESUtils.generateKey();

    const encodedMessage = aes.encrypt(message);
    const decodedMessage = aes.decrypt(encodedMessage);

    expect(decodedMessage).toEqual(message);
  });
});
