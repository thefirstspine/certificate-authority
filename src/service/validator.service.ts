import * as crypto from 'crypto';

/**
 * Global service to validate incoming requests.
 * This service will use the environment variable `PRIVATE_KEY` to fetch the private key.
 */
export class ValidatorService {

  /**
   * Challenge the certificate against the private key.
   * @param certificate The decoded certificate provided by the request
   */
  challenge(certificate: string): boolean {
    // Here we ensure that we do not have any escaped '\n' character left
    const publicKeyStr: string = certificate.replace(/\\n/gm, '\n');
    const privateKeyStr: string = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');

    try {
      // Create the challenge
      const challenge: string = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(10);

      // Encrypt / decrypt the challenge
      const encryptedBuffer: Buffer = crypto.publicEncrypt(publicKeyStr, new Buffer(challenge));
      const decryptedBuffer: Buffer = crypto.privateDecrypt(privateKeyStr, encryptedBuffer);

      // Return challenge result
      return decryptedBuffer.toString() === challenge;
    } catch (exception) {}

    return false;
  }

}

export default new ValidatorService();
