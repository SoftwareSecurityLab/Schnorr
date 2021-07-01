/**
 * Schnorr module
 * @module
 */
const Prover = require('./modules/prover');
const Verifier = require('./modules/verifier');
const bigInteger = require('big-integer');
const debug = require('debug');
const ElGamal = require('basic_simple_elgamal');


/**
 * @typedef {Object} Proof - The NIZK Schnorr proof.
 * @property {bigInteger.BigInteger|string} commitment - The commitment which is made randomly
 * by prover.
 * @property {bigInteger.BigInteger|string} response - The response which contains the secret 
 * knowledge r and is used to prove the knowledge of secret.
 */


const log = debug('app::NIZKP::Schnorr');


/**
 * The class which integrate the prover and verifier both together and give you
 * the schnorr module at once.
 * Though this module works upon ElGamal engine but don't worry! if you use discrete logarithm 
 * and you want to prove the secret, you can use this module too. As matter of fact you even don't
 * need to know what is ElGamal and how it works.
 * Also you should note that this module just works upon Multiplicative group!
 */
class Schnorr{
    /**
     * Initialize the prover and verifier with multiplicative group which you use in your
     * computations. you can initialize schnorr by passing an instance of you ElGamal engine if
     * you have one or initialize with the Modulus and generator separately
     * @param {ElGamal|string|bigInteger.BigInteger} p - The ElGamal engine or the modulus of the
     * multiplicative group, if you pass ElGamal engine then you can leave the q as undefined.   
     * @param {string|bigInteger.BigInteger} [g] - The generator of the underlying multiplicative group.
     * @throws Will throw an error if wrong type of arguments is passed.
     */
    constructor(p, g){
        let generator = undefined;
        let modulus = undefined;
        if(p instanceof ElGamal){
            generator = p.generator;
            modulus = p.modulus;
        }else if(typeof p === 'string')
            modulus = bigInteger(p);
        else if(p instanceof bigInteger)
            modulus = p;
        else
            throw new Error('Wrong type of modulus is passed!');

        
        if(generator === undefined){
            if(typeof g === 'string')
                generator = bigInteger(g);
            else if(g instanceof bigInteger)
                generator = g;
            else
                throw new Error('Wrong type of generator is passed!');
        }

        /**
         * @property {Prover} prover - The underlying prover class.
         */
        this.prover = new Prover({
            p: modulus,
            g: generator
        });

        /**
         * @property {Verifier} verifier - The underlying verifier class.
         */
        this.verifier = new Verifier({
            p: modulus,
            g: generator
        });

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
        return this.prover.prove(r, x)
    }

    
    /**
     * Verify knowledge of 'r' which is used in producing of 'x': x = g^{r}
     * @param {bigInteger.BigInteger|string} x - The argument which the prover should prove 
     * he knows its secret knowledge and how it's produced.
     * @param {Proof} proof - The Schnorr proof which is resulted by calling prove() method and
     * you use it to verify prover's knowledge of secret.
     * @returns {boolean} Returns true if NIZK Schnorr proof verified and false otherwise
    */
    verify(x, proof){
        return this.verifier.verify(x, proof);
    } 

}



/**
 * Schnorr class
 */

module.exports = Schnorr;