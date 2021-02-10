const crypto = require('crypto')
const {Keccak} = require('sha3')
const basex = require('base-x')

const {
  sign,
  randomBytes
} = require('tweetnacl')

const {
  decodeUTF8
} = require('tweetnacl-util')

class Crypto {

  static toBase32(data) {
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }
    return Crypto.bs32.encode(data)
  }

  static fromBase32(data) {
    return Crypto.bs32.decode(data)
  }

  static SHA3(data) {
    const hash = new Keccak(256)
    hash.update(data)
    return hash.digest()
  }

  static getRandomString(length = 12, encode = 'hex') {
    return crypto.randomBytes(length).toString(encode)
  }

  static b32Hash(data, size) {
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }
    return Crypto.bs32.encode(Crypto.SHA3(data)).substring(0, size)
  }

  static seedFromPassphrase(passphrase) {
    if (typeof passphrase === 'string' && passphrase.length > 0) {
      return Uint8Array.from(Crypto.SHA3(passphrase))
    } else {
      throw new Error('Not a valid string')
    }
  }

  static generateSignatureKeyPair(seed) {
    let pair
    if (seed) {
      pair = sign.keyPair.fromSeed(seed)
    } else {
      pair = sign.keyPair()
    }
    return pair
  }

  static getSignature(message, secretKey) {
    let signature = sign.detached(decodeUTF8(message), secretKey)
    return Crypto.bs58.encode(Buffer.from(signature))
  }

  static verifySignature(message, signature, publicKey) {
    let verified = sign.detached.verify(decodeUTF8(message), Crypto.bs58.decode(signature), publicKey)
    return verified
  }

  static isValidPublicKey(key) {
    if (key instanceof Uint8Array) {
      return key.length === 32
    } else {
      return false
    }
  }

  static isValidSecretKey(key) {
    if (key instanceof Uint8Array) {
      return key.length === 64
    } else {
      return false
    }
  }

}

Crypto.base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
Crypto.bs58 = basex(Crypto.base58Alphabet)

Crypto.zBase32Alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769'
Crypto.bs32 = basex(Crypto.zBase32Alphabet)

Crypto.randomBytes = randomBytes

module.exports = Crypto
