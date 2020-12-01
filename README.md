# SignAuth

SignAuth is a protocol for web authentication using challenges and signatures (like Fido2) but derivating the keys from a password.


## Usage

Install it using
```
npm install signauth
```
or `yarn` or `pnpm` or whatever.

Use it with
```
const SignAuth = require('signauth')
const signAuth = new SignAuth()

```

## API

### Methods

### signAuth.newChallengeForUser(userid)
Creates a new challenge for the user. `userid` must be a not empty string.

### signAuth.hashChallenge(challenge)
Hashes a challenge. This method is called internally.

### signAuth.validateChallenge(challenge)
Validates a challenge

### signAuth.verifySignedChallenge(challenge, signature, publicKey)
Verifies the signature of a challenge. The method is called internally

### signAuth.verifyPayload(payload)
Verifies that a payload is valid

### Static methods

### SignAuth.getPayload(challenge, pair)
Get the payload of a challenge using the ed25519 pair 

### SignAuth.getPairFromPassphrase(passphrase)
Generate a seed from the passphrase and uses the seed to generate a pair of ed25519 keys

### SignAuth.signChallenge(challenge, secretKey)
Signs a challenge using `secretKey`

## Example

In the browser when the user puts `userid` and `password` you should call a first time the API to get a challenge for that user. 

```
const SignAuth = require('signauth')

const userid = 'sullof'
const passphrase = 'an orange sales of odd trumpets'

(async function () {

    const challenge = await clientAPI('/new-challenge?userid=' + userid)
    const pair = SignAuth.getPairFromPassphrase(passphrase)
    const payload = SignAuth.getPayload(challenge, pair.secretKey)
    const jwt = await clientAPI('/get-jwt-token?payload=' + JSON.stringify(payload))
    ...

})()

```

On the server side, you will have two api, one to return the challenge, the second to verify the payload and associate the `userid` to the `publicKey`

```
const SignAuth = require('signauth')
const signAuth = new SignAuth()

get('/new-challenge', function (req, res) {
    let userid = req.query.userid
    res.json({
        success: true,
        challenge: signAuth.newChallengeForUser(userid)
    })
})

get('/get-jwt-token', function (req, res) {
    payload = JSON.parse(req.query.payload)
    if (signAuth.verifyPayload(payload)) {
        let user = db.getUser(userId))
        if (user) {
            // userid has already signed up
            if (user.publicKey !== payload.publicKey) {
                res.json(
                    success: false,
                    error: `wrong key`
                )
                return
            }
        } else {
            // we save it for future logins
            db.putUser(userid, payload.publicKey)
        }
        res.json({
            jwt: getJWTToken(userid)
        })
    } else {
        res.json({
            success: false,
            error: 'wrong payload'
        })
    }
})


```




## History

__0.0.4__
* Better example in README

__0.0.3__
* completing methods and tests 

__0.0.1__
* first version of the Crypto class is a simplified version of @secrez/core:Crypto  


## Test coverage

```
  6 passing (75ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 index.js |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
```


## Copyright

(c) 2020-present [Francesco Sullo](https://francesco.sullo.co) (<francesco@sullo.co>)

## Licence

MIT
