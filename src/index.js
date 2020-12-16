const Crypto = require('@secrez/crypto')

class SignAuth {

  constructor(size = 8, expiresIn = 10) {
    if (typeof size !== 'number' || parseInt(size.toString()) !== size || size === 0) {
      throw new Error('size must be a positive integer')
    }
    if (typeof expiresIn !== 'number' || parseInt(expiresIn.toString()) !== expiresIn || expiresIn === 0) {
      throw new Error('expiresIn must be a positive integer')
    }
    this.salt = Crypto.getRandomString(12)
    this.size = size
    this.expiresIn = expiresIn
  }

  newChallenge(userid, nonce = 1) {
    if (typeof userid !== 'string' || userid.length === 0) {
      throw new Error('userid must be a not empty string')
    }
    const challenge = {
      userid: Crypto.b32Hash(userid),
      now: Date.now(),
      expiresIn: this.expiresIn,
      nonce,
      bytes: Crypto.toBase32(Crypto.randomBytes(this.size))
    }
    challenge.hash = this.hashChallenge(challenge)
    return challenge
  }

  hashChallenge(challenge) {
    try {
      return Crypto.b32Hash(
          this.salt +
          challenge.userid +
          challenge.now +
          this.expiresIn +
          challenge.nonce +
          challenge.bytes.toString()
      )
    } catch (e) {
      throw new Error('invalid challenge')
    }
  }

  validateChallenge(challenge) {
    return this.hashChallenge(challenge) === challenge.hash
  }

  verifySignedChallenge(challenge, signature, publicKey) {
    this.validateChallenge(challenge)
    challenge = JSON.stringify(challenge)
    return Crypto.verifySignature(challenge, signature, publicKey)
  }

  verifyPayload(payload) {
    return this.verifySignedChallenge(
        payload.challenge,
        payload.signature,
        Crypto.fromBase32(payload.publicKey)
    )
  }

  // static

  static getPayload(challenge, pair) {
    return {
      challenge,
      signature: SignAuth.signChallenge(challenge, pair.secretKey),
      publicKey: Crypto.toBase32(pair.publicKey)
    }
  }

  static getPairFromPassphrase(passphrase) {
    let seed = Crypto.seedFromPassphrase(passphrase)
    return Crypto.generateSignatureKeyPair(seed)
  }

  static signChallenge(challenge, secretKey) {
    challenge = JSON.stringify(challenge)
    return Crypto.getSignature(challenge, secretKey)
  }

}

SignAuth.Crypto = Crypto

module.exports = SignAuth
