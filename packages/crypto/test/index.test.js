const chai = require('chai')
const assert = chai.assert
const Crypto = require('../src')

const {
  password,
  b32Hash,
  signaturePair
} = require('./fixtures')

describe('#Crypto', function () {

  it('should verify a string is a base32 one', async function () {
    assert.isTrue(Crypto.isBase32String('arde'))
    assert.isTrue(Crypto.isBase32String('aa99'))
    assert.isFalse(Crypto.isBase32String('ardl'))
    assert.isFalse(Crypto.isBase32String('Idaf'))
    assert.isFalse(Crypto.isBase32String('as0s'))
  })

  it('should convert from Base32 to array and viceversa', async function () {
    assert.equal(Crypto.fromBase32('89').toString('utf8'), Buffer.from([255]))
    assert.equal(Crypto.toBase32([255]), '89')
  })

  it('should convert a decimal to an uint8array', async function () {
    let ts = 1576126788489..toString(16)
    let expected = [1, 110, 248, 122, 51, 137]
    let result = Crypto.hexToUint8Array(ts)
    assert.isTrue(Crypto.isUint8Array(result))
    for (let i = 0; i < result.length; i++) {
      assert.equal(result[i], expected[i])
    }
  })

  it('should convert a uint8Array to a decimal', async function () {
    let uint8 = Uint8Array.from([1, 110, 248, 122, 51, 137])
    let hexTs = Crypto.uint8ArrayToHex(uint8)
    let expected = 1576126788489
    assert.equal(expected, parseInt(hexTs, 16))
  })

  it('should generate a random string', async function () {
    let randomString = await Crypto.getRandomString()
    assert.equal(randomString.length, 24)

    randomString = await Crypto.getRandomString(4)
    assert.equal(randomString.length, 8)

    randomString = await Crypto.getRandomString(12, 'base64')
    assert.isTrue(randomString.length > 8 && randomString.length < 18)
  })

  it('should get a random base32 string', async function () {
    let rnd = Crypto.getRandomBase32String(3)
    assert.equal(rnd.length, 3)
    assert.isTrue(Crypto.zBase32Alphabet.indexOf(rnd[1]) !== -1)
  })

  it('should generate a sha3 in b32 format', async function () {
    this.timeout(20000)
    assert.equal(Crypto.b32Hash(password), b32Hash)
    assert.equal(Crypto.b32Hash(password, 10), b32Hash.substring(0, 10))
    assert.isTrue(Crypto.isValidB32Hash(b32Hash))
  })

  it('should generate an ed25519 key pair', async function () {
    let pair = Crypto.generateSignatureKeyPair()
    assert.isTrue(Crypto.isValidPublicKey(pair.publicKey))
  })

  it('should derive a valid seed from a password', async function () {
    let password = 'some random password'
    let seed = Crypto.seedFromPassword(password)
    assert.isTrue(Crypto.isUint8Array(seed))
    assert.equal(seed.length, 32)

    try {
      Crypto.seedFromPassword(234)
    } catch (e) {
      assert.equal(e.message, 'Password is not a valid string')
    }

    try {
      Crypto.seedFromPassword('')
    } catch (e) {
      assert.equal(e.message, 'Password is not a valid string')
    }

  })

  it('should generate an ed25519 key pair from a seed', async function () {
    let password = 'when John breaks the cronicle'
    let seed = Crypto.seedFromPassword(password)
    let pair = Crypto.generateSignatureKeyPair(seed)
    assert.isTrue(Crypto.isValidPublicKey(pair.publicKey))
    assert.isTrue(Crypto.isValidSecretKey(pair.secretKey))
    assert.equal(pair.publicKey.join(','), signaturePair.publicKey.join(','))
    assert.equal(pair.secretKey.join(','), signaturePair.secretKey.join(','))
  })

  it('should sign a string', async function () {
    let pair = Crypto.generateSignatureKeyPair()
    const msg = 'Some message'
    const signature = Crypto.getSignature(msg, pair.secretKey)
    const verified = Crypto.verifySignature(msg, signature, pair.publicKey)
    assert.isTrue(verified)

  })

  it('should verify that wrong keys are not valid', async function () {
    let pair = Crypto.generateSignatureKeyPair()
    assert.isFalse(Crypto.isValidPublicKey(pair.secretKey))
    assert.isFalse(Crypto.isValidSecretKey(pair.publicKey))
    assert.isFalse(Crypto.isValidPublicKey(Crypto.getRandomString(12)))
    assert.isFalse(Crypto.isValidSecretKey(Crypto.getRandomString(24)))
  })

})
