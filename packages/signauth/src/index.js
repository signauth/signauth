const Crypto = require('@signauth/crypto')

class SignAuth {

  static newChallenge(expiresIn = 60) {
    let challenge = [
      Date.now(),
      expiresIn,
      Crypto.randomBytes(8)
    ]
    return challenge
  }

  static validateChallenge(challenge, expectedExpiresIn = 60) {
    return (
        challenge[1] === expectedExpiresIn &&
        challenge[0] + 1000 * expectedExpiresIn > Date.now() &&
        Crypto.isUint8Array(challenge[2]) &&
        challenge[2].length === 8
    )
  }

  static challengeToString(challenge) {

  }

}

module.exports = SignAuth
