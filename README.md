# SignAuth

SignAuth is a protocol for web authentication using challenges and signatures (like Fido2) but derivating the keys from a password.

## Why

When you authenticate yourself on Twitter, Facebook, Pinterest, etc. the website sends you password to the server. There, the password is derivated before being saved in the database. However, an employee could set a backdoor at that level and steal your password.

SignAuth solves entirely the problem because it uses your password locally to sign a challenge. This way, the server receive a public key and stores that.

## The flow

  <img align="center" src="https://raw.githubusercontent.com/signauth/signauth/master/assets/signauth-flow.png"/>

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

### signAuth.newChallenge(userid)
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

_The code is not working code. It is to give you an idea. Real code will come with examples._

In the browser when the user puts `userid` and `password` you should call a first time the API to get a challenge for that user. 

```
const SignAuth = require('signauth')

const userid = 'sullof'
const password = 'an orange sales of odd trumpets'
const passphrase = userid + password

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

// login
get('/new-challenge', function (req, res) {
    let userid = req.query.userid
    let user = db.getUser(userId))
    if (user) {
        res.json({
            success: true,
            challenge: signAuth.newChallenge(userid, user.nonce)
        })
    } else {
        res.json({
            success: false,
            error: 'user not found. Please signup'
        })
    }
})

// signup
get('/first-challenge', function (req, res) {
    let userid = req.query.userid
    let user = db.getUser(userId))
    if (!user) {
        db.createUser(userid, { nonce: 1 })
        res.json({
            success: true,
            challenge: signAuth.newChallenge(userid, 1)
        })
    } else {
        res.json({
            success: false,
            error: 'user exists. Please login'
        })
    }
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
            } else {
                db.updateUser(userid, { nonce: nonce + 1 })
                res.json({
                    jwt: getJWTToken(userid)
                })
            }
        } else {
            res.json({
                success: false,
                error: 'user not found. Please signup'
            })
        }
    }
    res.json({
        success: false,
        error: 'wrong payload'
    })
})


```



## History

__0.0.5__
* Using the nonce properly

__0.0.4__
* Better example in README

__0.0.3__
* completing methods and tests 

__0.0.1__
* first version of the Crypto class is a simplified version of @secrez/core:Crypto  


## Test coverage

```
  6 passing (80ms)

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
