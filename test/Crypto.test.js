const chai = require('chai')
const assert = chai.assert
const fs = require('fs')
const path = require('path')

const Crypto = require('../src/Crypto')
const utils = require('@secrez/utils')
const bs58 = Crypto.bs58

const {
  box,
  secretbox
} = require('tweetnacl')


const {
  password,
  b58Hash,
  b32Hash,
  passwordSHA3Hex,
  passwordB64,
  salt,
  iterations,
  hash23456iterations,
  passphrase,
  signaturePair
} = require('./fixtures')

describe('#Crypto', function () {

  const u = undefined

  describe('utils', async function () {

    it('should convert from Base32 to array and viceversa', async function () {
      assert.equal(Crypto.fromBase32('89').toString('utf8'), Buffer.from([255]))
      assert.equal(Crypto.toBase32([255]), '89')
    })

    it('should generate a random string', async function () {
      let randomString = await Crypto.getRandomString()
      assert.equal(randomString.length, 24)

      randomString = await Crypto.getRandomString(4)
      assert.equal(randomString.length, 8)

      randomString = await Crypto.getRandomString(12, 'base64')
      assert.isTrue(randomString.length > 8 && randomString.length < 18)
    })

  })

  describe('sign a message with a secretKey', function () {

    let pair = Crypto.generateSignatureKeyPair()

    it('should sign a string', async function () {
      const msg = 'Some message'
      const signature = Crypto.getSignature(msg, pair.secretKey)
      const verified = Crypto.verifySignature(msg, signature, pair.publicKey)
      assert.isTrue(verified)

    })

    it('should derive a valid seed from a passphrase', async function () {
      let passphrase = 'some random passphrase'
      let seed = Crypto.seedFromPassphrase(passphrase)
      assert.equal(seed.length, 32)

      try {
        Crypto.seedFromPassphrase(234)
      } catch (e) {
        assert.equal(e.message, 'Not a valid string')
      }

      try {
        Crypto.seedFromPassphrase('')
      } catch (e) {
        assert.equal(e.message, 'Not a valid string')
      }

    })

    it('should generate an ed25519 key pair from a seed', async function () {
      let seed = Crypto.seedFromPassphrase(passphrase)
      let pair = Crypto.generateSignatureKeyPair(seed)
      assert.isTrue(Crypto.isValidPublicKey(pair.publicKey))
      assert.isTrue(Crypto.isValidSecretKey(pair.secretKey))
      assert.equal(pair.publicKey.join(','), signaturePair.publicKey.join(','))
      assert.equal(pair.secretKey.join(','), signaturePair.secretKey.join(','))
    })

  })



})
