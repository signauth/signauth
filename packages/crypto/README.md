# @signauth/crypto

SignAuth is a protocol for web authentication using challenges signed with a private key derivated from a password.

The signature is performed via `ed25519`. For more info loot at [TweetNaCl.js](https://github.com/dchest/tweetnacl-js/blob/master/README.md#signatures) 

It exposes 
* Crypto

## Usage

Install it using
```
npm install @signauth/crypto
```
or `yarn` or `pnpm` or whatever.

Use it with
```
const Crypto = require('@signauth/crypto')
```

## API

### Static methods

#### Crypto.toBase32(data)
Converts the data in base32 format. See [human-oriented base-32 encoding](https://philzimmermann.com/docs/human-oriented-base-32-encoding.txt)

#### Crypto.fromBase32(base32String)
Converts from base32 to a buffer

#### Crypto.getRandomBase32String(size)
Generates a random base32 string 

#### Crypto.getRandomString(length = 12, encode = 'hex')
Generates a random string encoded, by default, as hexadecimal string 

#### Crypto.SHA3(data)
Hashes the data in format Keccak256

#### Crypto.b32Hash(data, size)
Returns a sha3 hash in base32 format.
`size` can limit the size of the final string

#### Crypto.isValidB32Hash(base32Hash)
Checks if `base32Hash` is a valid base32 hash  

#### Crypto.hexToUint8Array(hexStr)
Converts an hexadecimal string to `uint8Array`

#### Crypto.uint8ArrayToHex(uint8)
Convert a `uint8Array` to a hexadecimal string

#### Crypto.isBase32String(str)
Checks if the string looks like a base32 string

#### Crypto.isUint8Array(data)
Checks is `data` is a uint8Array

#### Crypto.seedFromPassphrase(password)
Derives a password to generate a seed as an `uint8Array`

#### Crypto.generateSignatureKeyPair(seed) {
Uses a seed to generate a pair of `ed25519` keys

#### Crypto.isValidPublicKey(key)
Verifies if `key` is a valid publicKey

#### Crypto.isValidSecretKey(key)
Verifies if `key` is a valid secretKey

#### Crypto.getSignature(message, secretKey)
Signes `message` using `secretKey` 

#### Crypto.verifySignature(message, signature, publicKey)
Verifies the message

## History

__0.0.3__
* Improving README

__0.0.2__
* completing methods and testing  

__0.0.1__
* first version of the Crypto class is a simplified version of @secrez/core:Crypto  


## Test coverage

```

```


## Copyright

(c) 2020-present [Francesco Sullo](https://francesco.sullo.co) (<francesco@sullo.co>)

## Licence

MIT
