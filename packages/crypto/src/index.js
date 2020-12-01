/*
This class is a simplified slightly-modified version of @secrez/core:Crypto
https://github.com/secrez/secrez/blob/master/packages/core/src/Crypto.js
**/

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

  static getRandomBase32String(size) {
    let i = Math.round(size / 2)
    let j = i + size
    return Crypto.bs32.encode(Buffer.from(randomBytes(2 * size))).substring(i, j)
  }

  static getRandomString(length = 12, encode = 'hex') {
    return crypto.randomBytes(length).toString(encode)
  }

  static SHA3(data) {
    const hash = new Keccak(256)
    hash.update(data)
    return hash.digest()
  }

  static b32Hash(data, size) {
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }
    return Crypto.bs32.encode(Crypto.SHA3(data)).substring(0, size)
  }

  static isValidB32Hash(hash) {
    return Crypto.bs32.decode(hash).length === 32
  }

  static hexToUint8Array(hexStr) {
    if (hexStr.length % 2) {
      hexStr = '0' + hexStr
    }
    return new Uint8Array(hexStr.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
  }

  static uint8ArrayToHex(uint8) {
    return Buffer.from(uint8).toString('hex')
  }

  static isBase32String(str) {
    let re = RegExp(`[^${Crypto.base32Alphabet}]+`)
    return !re.test(str)
  }

  static isUint8Array(key) {
    return typeof key === 'object' && key.constructor === Uint8Array
  }

  static seedFromPassword(password) {
    if (typeof password === 'string' && password.length > 0) {
      return Uint8Array.from(Crypto.SHA3(password))
    } else {
      throw new Error('Password is not a valid string')
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

  static isValidPublicKey(pk) {
    if (pk instanceof Uint8Array) {
      return pk.length === 32
    } else {
      return false
    }
  }

  static isValidSecretKey(pk) {
    if (pk instanceof Uint8Array) {
      return pk.length === 64
    } else {
      return false
    }
  }

  static getSignature(message, secretKey) {
    let signature = sign.detached(decodeUTF8(message), secretKey)
    return Crypto.bs32.encode(Buffer.from(signature))
  }

  static verifySignature(message, signature, publicKey) {
    let verified = sign.detached.verify(decodeUTF8(message), Crypto.bs32.decode(signature), publicKey)
    return verified
  }

}

Crypto.base32Alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769'
Crypto.bs32 = basex(Crypto.base32Alphabet)
Crypto.randomBytes = randomBytes

module.exports = Crypto
