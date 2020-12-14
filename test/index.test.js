const chai = require('chai')
const assert = chai.assert

const SignAuth = require('../src')

const {
  password,
  userid,
  signaturePair
} = require('./fixtures')


describe('#SignAuth', function () {

  const signAuth = new SignAuth()


  it('should instantiate a SignAuth instance', async function () {
    const instance = new SignAuth()
    assert.equal(instance.size, 8)
    assert.equal(instance.expiresIn, 10)

    try {
      new SignAuth('well')
    } catch (e) {
      assert.equal(e.message, 'size must be a positive integer')
    }

    try {
      new SignAuth(undefined, 'well')
    } catch (e) {
      assert.equal(e.message, 'expiresIn must be a positive integer')
    }

  })

  it('should generate a new challenge for the user', async function () {
    let challenge = signAuth.newChallenge(userid)
    assert.isTrue(challenge.now <= Date.now())
    assert.equal(challenge.expiresIn, 10)
    assert.equal(SignAuth.Crypto.fromBase32(challenge.bytes).length, 8)
    assert.equal(challenge.nonce, 1)
    assert.equal(challenge.hash, signAuth.hashChallenge(challenge))

    try {
      signAuth.newChallenge(null)
    } catch (e) {
      assert.equal(e.message, 'userid must be a not empty string')
    }

  })

  it('should validate a challenge', async function () {
    let challenge = signAuth.newChallenge(userid)
    assert.isTrue(signAuth.validateChallenge(challenge))
    try {
      challenge = {}
      signAuth.validateChallenge(challenge)
    } catch (e) {
      assert.equal(e.message, 'invalid challenge')
    }

  })

  it('should get a seed from a password', async function () {
    let pair = SignAuth.getPairFromPassphrase(password)
    assert.equal(pair.publicKey.join(','), signaturePair.publicKey.join(','))
    assert.equal(pair.secretKey.join(','), signaturePair.secretKey.join(','))
  })

  it('should get a signed challenge', async function () {
    let pair = SignAuth.getPairFromPassphrase(password)
    let challenge = signAuth.newChallenge(userid)
    let signature = SignAuth.signChallenge(challenge, pair.secretKey)
    assert.isTrue(signAuth.verifySignedChallenge(challenge, signature, pair.publicKey))

    try {
      signAuth.verifySignedChallenge({}, signature, pair.publicKey)
    } catch (e) {
      assert.equal(e.message, 'invalid challenge')
    }


  })

  it('should get a challenge payload', async function () {
    let challenge = signAuth.newChallenge(userid)
    let pair = SignAuth.getPairFromPassphrase(password)
    let payload = SignAuth.getPayload(challenge, pair)
    assert.isTrue(signAuth.verifyPayload(payload))

  })


})
