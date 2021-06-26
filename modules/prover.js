/**
 * Prover module
 * @module ./prover
 */
const bigInteger = require('big-integer');
const debug = require('debug');
const ElGamal = require('basic_simple_elgamal');
const crypto = require('crypto');


const log = debug('NIZKP::Schnorr');
const hash = crypto.createHash('SHA3-512');


/**
 * @typedef {'HIGH'|'LOW'|'MEDIUM'} securityLevel
 */
/**
 * @typedef {Object} ElGamalInfo the object containing essential information to build the ElGamal
 *  cryptoengine again
 * @property {bigInteger.BigInteger} p - The modulus of underlying group and determine the whole Cyclic group
 * @property {bigInteger.BigInteger} g - The generator of underlying group.
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


/**
 * Class to create your own prover.
 * The prover works over a cyclic group and specially here, we use multiplicative groups as
 * cyclic group which is identified by (g, p) pair where g is 
 * generator of cyclic group and p is the modulus which is used in multiplicative group.
 */
class Prover{
    /**
     * Initialize ElGamal engine which is used to prove the secret knowledge.
     * @param {ElGamalInfo} elgamalInfo - The essential info for underlying ElGamal engine.
     */
    constructor(elgamalInfo){
        /**
         * @property {ElGamal} - The underlying engine to prove the knowledge using it. 
         */
        this.elgamal = new ElGamal(elgamalInfo.p, elgamalInfo.g);
    }

    /**
     * Prove the secret "r" to verifier, to be more accurate, you prove that y = g^r without 
     * revealing the secret "r".
     * @param {bigInteger.BigInteger|string} r - The secret knowledge which you want to prove. 
     * @param {bigInteger.BigInteger|string} [x] - The public info which is g^r
     * @returns {Promise<Proof>} - the resulted schnorr proof.
     * @throws Will throw an error if given secret knowledge is not type of string nor big integer.
     */
    async prove(r, x){
        let commitment = await this.elgamal.randomGropuMember();
        let t = this.elgamal.power(commitment);
        let secretKnowledge = undefined;
        let toProve = undefined;

        if(typeof r === 'string')
            secretKnowledge = bigInteger(r);
        else if(r instanceof bigInteger)
            secretKnowledge = r;
        else
            throw new Error('The secret knowledge whould be of type string or big integer.');
            
        if(typeof x === 'string')
            toProve = bigInteger(x);
        else if(x instanceof bigInteger)
            toProve = x;
        else
            toProve = this.elgamal.power(secretKnowledge);
        hash.update(this.elgamal.generator);
        hash.update(toProve.toString());
        hash.update(t.toString());
        
        /**
         * The Challenge:
         */
        let c = hash.digest('hex');

        /**
         * Numerical representation of digest hash 'c':
         */
        let nrc = bigInteger(c, 16);

        /**
         * Response:
         */
        let response = this.elgamal.add(commitment, this.elgamal.multiply(nrc.negate(), r));
        return {
            commitment,
            response
        };
    }
}


/**
 * Prover class
 */
module.exports = Prover;