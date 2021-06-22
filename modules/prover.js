/**
 * Prover module
 * @module prover
 */
const bigInteger = require('big-integer');
const debug = require('debug');
const ElGamal = require('basic_simple_elgamal');


const log = debug('NIZKP::Schnorr');

/**
 * Class to create your own prover.
 * The prover works over a cyclic group and specially here, we use multiplicative groups as
 * cyclic group which is identified by (g, p) pair where g is 
 * generator of cyclic group and p is the modulus which is used in multiplicative group.
 */
class prover{
    /**
     * Initialize the underlying multiplicative group
     * @param {bigInteger|string} g - The generator of multiplicative group.
     * @param {bigInteger|string} p - The modulus of multiplicative group.
     * @throws Will throw an Error if one of 'g' or 'p' is string but it's not a valid integer.
     * @throws Will throw an Error if one of 'g' or 'p' is neither a string nor a big integer.
     */
    constructor(g, p){
        /**
         * @property {bigInteger} g - The generator of underlying multiplicative group.
         */
        try{
        if(typeof g === 'string')
            this.generator = bigInteger(g);
        else if(g instanceof bigInteger)
            this.generator = g;
        else
            this.generator = undefined;
        }catch(err){
            log('Error when initializing generator:', err);
            throw new Error('Error: generator is not a valid big integer!');
        }

        if(this.generator === undefined){
            log('Error: generator is not a string nor a big integer:', g);
            throw new Error('Wrong type of generator! it\'s must be either a string or a big integer');
        }
        
        /**
         * @property {bigInteger} p - The modulus of underlying multiplicative group.
         */
        try{
            if(typeof p === 'string'){
                this.modulus = bigInteger(p);
            }else if(p instanceof bigInteger)
                this.modulus = p;
            else 
                this.modulus = undefined;
        }catch(err){
            log('Error when initializing modulus:', err);
            throw new Error('Error: modulus is not a valid big integer');
        }

        if(this.modulus === undefined){
            log('Error: modulus is not a string nor a big integer:', g);
            throw new Error('Wrong type of modulus! it\'s must be either a string or a big integer');
        }

        this.elgamal = new ElGamal;
    }

    /**
     * prove the secret "r" to verifier
     * @param {bigInteger|string} r - the secret which you want to prove. 
     * @returns {string} - the resulted schnorr proof.
     */
    prove(r){

        return ;
    }
}