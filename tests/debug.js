const ElGamal = require('basic_simple_elgamal');
const debug = require('debug');
const bigInteger = require('big-integer');


const log = debug('app::Test');


async function test(){
    const elgamal = new ElGamal();
    await elgamal.initializeRemotely(2048);
    const a = await elgamal.randomGropuMember();
    const ga = elgamal.power(a);
    const b = await elgamal.randomGropuMember();
    const p = bigInteger(elgamal.modulus);
    const ab = a.multiply(b).mod(p);
    log('g^{ab} = g^{a}^{b}: ', elgamal.power(ab).equals(
        ga.modPow(b, p)
    ))
}


test();