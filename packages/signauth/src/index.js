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
    return [challenge[0], challenge[1], challenge[2].join(',')].join(';')
  }

  static challengeFromString(challenge) {
    return challenge.split(';').map((elem, index) => {
      if (index === 2) {
        return Uint8Array.from(elem.split(','))
      } else {
        return parseInt(elem)
      }
    })
  }

  static getPairFromPassword(password) {
    let seed = Crypto.seedFromPassword(password)
    return Crypto.generateSignatureKeyPair(seed)
  }

  static signChallenge(challenge, secretKey) {
    if (typeof challenge !== 'string') {
      challenge = SignAuth.challengeToString(challenge)
    }
    return Crypto.getSignature(challenge, secretKey)
  }

  static verifyChallenge(challenge, expectedExpiresIn, signature, publicKey) {
    if (typeof challenge !== 'string') {
      challenge = SignAuth.challengeToString(challenge)
    }
    if (SignAuth.verifyChallenge(challenge, expectedExpiresIn)) {
      return Crypto.verifySignature(challenge, signature, publicKey)
    } else {
      return false
    }
  }

}

SignAuth.Crypto = Crypto

module.exports = SignAuth
