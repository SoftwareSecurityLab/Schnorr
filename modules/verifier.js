/**
 * Verifier module
 * @module ./verifier
 */
const bigInteger = require('big-integer');
const ElGamal = require('basic_simple_elgamal');
const crypto = require('crypto');
const debug = require('debug');
const jsHash = require('js-sha3');


/**
 * @typedef {'HIGH'|'LOW'|'MEDIUM'} securityLevel
 */
/**
 * @typedef {Object} ElGamalInfo the object containing essential information to build the ElGamal
 *  cryptoengine again
 * @property {bigInteger.BigInteger|string} p - The modulus of underlying group and determine the whole Cyclic group
 * @property {bigInteger.BigInteger|string} g - The generator of underlying group.
 * @property {bigInteger} [y] - The public key which is your public key and others can use it to 
 * encrypt messages for you.
 * @property {bigInteger} [x] - The private key(decryption key) which is strongly recommended to don't export it
 * @property {bigInteger} [r] - The secret key which is used in last encryption to build 
 * the cipherText.c1
 * @property {securityLevel} [security] - The engine security level.
 */
/**
 * @typedef {Object} Proof - The NIZK Schnorr proof.
 * @property {bigInteger.BigInteger|string} commitment - The commitment which is made randomly
 * by prover.
 * @property {bigInteger.BigInteger|string} response - The response which contains the secret 
 * knowledge r and is used to prove the knowledge of secret.
 */


const log = debug('app::NIZKP::Schnorr::Verifier');
let hash = undefined;
if(typeof process !== 'object' || typeof require !== 'function' || typeof module !== 'object'){
    hash = jsHash.sha3_512.create();
    hash.digest = hash.hex;
}else
    hash = crypto.createHash('SHA3-512');


/**
 * Class to create your own Schnorr verifier.
 * The verifer works over a cyclic group and specially here, we use multiplicative groups as
 * cyclic group which is identified by (g, p) pair where g is 
 * generator of cyclic group and p is the modulus which is used in multiplicative group.
 */
class Verifier{
    /**
     * Initialize the ElGamal engine which is used to verify the Schnorr proof.
     * @param {ElGamalInfo} elgamalInfo - The essential info for underlying ElGamal engine.
     */
    constructor(elgamalInfo){
        /**
         * @property {ElGamal} elgamal - The underlying engine to verify the proof using it.
         */
        this.elgamal = new ElGamal(elgamalInfo.p, elgamalInfo.g);
    }

    /**
     * Verify knowledge of 'r' which is used in producing of 'toVerify': toVerify = g^{r}
     * @param {bigInteger.BigInteger|string} toVerify - The argument which the prover should prove 
     * he knows its secret knowledge and how it's produced.
     * @param {Proof} proof - The Schnorr proof which you want to verify it.
     * @returns {boolean} Returns true if NIZK Schnorr proof verified and false otherwise
     */
    verify(toVerify, proof){
        if(typeof toVerify === 'string')
            toVerify = bigInteger(toVerify);
        if(typeof proof.commitment === 'string')
            proof.commitment = bigInteger(proof.commitment);
        if(typeof proof.response === 'string')
            proof.response = bigInteger(proof.response);

        hash.update(this.elgamal.generator);
        hash.update(toVerify.toString());
        hash.update(proof.commitment.toString());

        /**
         * Reproduced challenge:
         */
        let h = hash.digest('hex');
        /**
         * convert hash to a big-integer:
         */
        let c = bigInteger(h, 16);

        /**
         * g^s:
         */
        let gs = this.elgamal.power(proof.response);
        let p = bigInteger(this.elgamal.modulus);
        
        /**
         * consider renaming toVerify to y for shorthanding sakes:
         */
        let yc = toVerify.modPow(c, p);

        return proof.commitment.equals(this.elgamal.multiply(gs, yc));
    }
}


/**
 * Verifier class
 */
module.exports = Verifier;