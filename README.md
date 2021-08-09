- [Schnorr NIZKP](#schnorr-nizkp)
- [Installation](#installation)
- [Usage](#usage)
  - [Methods](#methods)
    - [`Schnorr(p)`](#schnorrp)
    - [`Schnorr(p, g)`](#schnorrp-g)
    - [`Prove(r, [x])`](#prover-x)
    - [`verify(x, proof)`](#verifyx-proof)
- [Example](#example)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

# Schnorr NIZKP

The non-interactive version of [original Schnorr zero-knowledge proof][sh].  
This project is purposed to be used with public key cryptosystem based on "Discrete Logarithm" such as ElGamal.

> Reminder: By having `r` as your secret, `g` as generator and `x` as g<sup>r</sup> = x and by assuming that verfiers knows both `x` and `g`, you want to prove that you know value of x without revealing it.

The [Fiat-Shamir heuristic][fsh] is applied to Schnorr protocol to make it non-interactive.

>NIZKP stands for 'Non-Interactive Zero Knowledge Proof'

You should first initialize the module with a [Cyclic Group][cg] then it's ready.  
This module works over [Multiplicative Group][mg] of integers as underlying [Cyclic Group][cg].

**NOTE:** This Module is developed for educational goals, although we developed it securely but the risk of using it in production environment is on you!



# Installation

Either you are using [Node.js][nj] or a browser, you can use it locally by downloading it from [npm][np]: 
```
npm install @software-security-lab/schnorr
```

# Usage

To include this module in your code simply:

```
const Schnorr = require('@software-security-lab/schnorr');
```

If you are using it in a browser, you may need to use a tool such as [browserify][by] to compile your code.

After including the module into your code, you can create your instance using `new` operator as described in [Methods](#methods) section.

## Methods

While introducing the methods, we use specific phrases which are listed below:
* **Throws Error:** Indicates the methods throw an error, the type or reason of possible errors is explained in the method's explanation.
* **Async:** Indicates this method is an asynchronous method which means you should wait for it to complete its execution.


### `Schnorr(p)`
* **`p`:** [`ElGamal`][ourelg]
* **Returns:** NIZKP Schnorr module
* **Throws Error:**

If you are using our [ElGamal][ourelg] module, you can directly pass your instance and then use it to proof your secret of knowledge.

`p` parameter is your instance of [`ElGamal`][ourelg] module:

```
const elgamal = new ElGamal();
await elgamal.initializeRemotely(2048);
elgamal.checkSecurity();
let schnorr = new Schnorr(elgamal);
```

Throws an error if `p` is of wrong type.

### `Schnorr(p, g)`
* **`p`:** `String` | [`big-integer`][bi]
* **`g`:** `String` | [`big-integer`][bi]
* **Returns:** NIZKP Schnorr proof.
* **Throws Error:**

If you're not using [ElGamal][ourelg] module and even not [ElGamal Encryption][eg], you can initialize the Schnorr this way.

`p` parameter is the modulus of underlying [Cyclic Group][cg].  
`g` parameter is the generator of underlying [Cyclic Group][cg].  
Throws an error if one of `p` or `g` is not provided or is of wrong type.

> Keep in mind the Schnorr works over [Cyclic Group][cg] which can be determined by its generator and its order.
> Since we are using [Multiplicative Groups][mg] as [Cyclic Groups][cg], modulus `p` specifies the group order implicitly.

### `Prove(r, [x])`

* **`r`:** `String` | [`big-integer`][bi]
* **`x`:** `String` | [`big-integer`][bi]
* **Returns:** Schnorr Proof
* **Async**
* **Throws Error**

Use this method to Proves your knowledge about secret `r`.

`r` parameter is your secret!   
`x` parameter is the info which you wants to prove your knowledge about it. In simple words, `x` is result of following modular exponentiation:   
`g`<sup>`r`</sup>` mod p = x`   
As you can see, `x` is optional. If you leave it `undefined` then we computes it internally.

Throws an error if `r` is not provided or is of wrong type.

**NOTE:** For security sakes, we get rid of `r` as soon as we computes the Schnorr proof. So make sure you keep it safe yourself.

### `verify(x, proof)`
* **`x`:** `String` | [`big-integer`][bi]
* **`proof`:** Schnorr Proof
* **Returns:** boolean

Verifies the knowledge of prover about secret of `x` considering the given `proof`

`proof` is resulted from calling [`Prove()`](#prover-x).   
`x` is the information which you wants to make sure the prover knows its knowledge.

Returns `true` if the knowledge of prover about secret of `x` is verifed and returns `false` otherwise.


# Example
A simple example is provided at [`./tests/main.js`][example] file which is available at [GitHub page][gitpage] too.

# Contributing
Since this module is developed at [Software Security Lab][softsl], you can pull requests but merging it depends on [Software Security Lab][softsl] decision.  
Also you can open issues first then we can discuss about it.

# Support
If you need help you can either open an issue in [GitHub page][gitpage] or contact the developers by mailing to golgolniamilad@gmail.com

# License
This work is published under [ISC][isc] license.



[sh]: https://en.wikipedia.org/wiki/Proof_of_knowledge#Schnorr_protocol
[fsh]: https://en.wikipedia.org/wiki/Fiat%E2%80%93Shamir_heuristic
[cg]: https://en.wikipedia.org/wiki/Cyclic_group
[np]: https://www.npmjs.com/
[nj]: https://nodejs.org/en/
[by]: https://browserify.org/
[ourelg]: https://www.npmjs.com/package/basic_simple_elgamal
[bi]: https://www.npmjs.com/package/big-integer
[eg]: https://en.wikipedia.org/wiki/ElGamal_encryption
[mg]: https://en.wikipedia.org/wiki/Multiplicative_group
[example]: ./tests/main.js
[gitpage]: https://github.com/SoftwareSecurityLab/Schnorr
[softsl]: https://github.com/SoftwareSecurityLab
[tmail]: mailto:maryam.mouzarani@gmail.com
[isc]: ./LICENSE
