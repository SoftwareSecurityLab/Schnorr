const ElGamal = require('basic_simple_elgamal');
const debug = require('debug');
const crypto = require('crypto');
const bigInteger = require('big-integer');


const log = debug('app::Prover Test');
const hash = crypto.createHash('SHA3-512');


async function test(){
    const elgamal = new ElGamal();
    
    let g = bigInteger('FF', 16)

    log(g);
}

test();