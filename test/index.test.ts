import { AES, AESUtils } from '../src';

describe('AES test cases', () => {
  it('should creates new instance', () => {
    const aes = new AES(AESUtils.generateKey());

    expect(aes).toBeDefined();
  });

  it('should encode', () => {
    const aes = new AES(AESUtils.generateKey());

    const message = AESUtils.generateKey();

    const encodedMessage = aes.encode(message);

    expect(encodedMessage).toBeDefined();
    expect(Array.isArray(encodedMessage)).toBeTruthy();
  });
});
