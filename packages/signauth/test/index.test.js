const chai = require('chai')
const assert = chai.assert

const SignAuth = require('../src/index')
// const signAuth = new SignAuth()

describe('#SignAuth', function () {

  it('should generate a new challenge', async function () {
    let challenge = SignAuth.newChallenge()

    console.log(JSON.stringify(challenge))

    assert.isTrue(challenge[0] <= Date.now())
    assert.isTrue(challenge[2].length === 8)
    assert.isTrue(challenge[0] + challenge[1] * 1000 > Date.now())
    assert.isTrue(challenge[1] === 60)

    challenge = SignAuth.newChallenge(2)
    assert.isTrue(challenge[0] <= Date.now())
    assert.isTrue(challenge[2].length === 8)
    assert.isTrue(challenge[0] + challenge[1] * 1000 > Date.now())
    assert.isTrue(challenge[1] === 2)
  })

  it('should validate a challenge', async function () {
    let challenge = SignAuth.newChallenge()
    assert.isTrue(SignAuth.validateChallenge(challenge))
  })


})
