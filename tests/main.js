const ElGamal = require('basic_simple_elgamal');
const Schnorr = require('../schnorr');
const debug = require('debug');
const crypto = require('crypto');
const bigInteger = require('big-integer');


const log = debug('app::Test');
const hash = crypto.createHash('SHA3-512');


async function test(){
    const elgamal = new ElGamal();
    
    await elgamal.initializeRemotely(2048);
    elgamal.checkSecurity();

    const m = await elgamal.randomGropuMember();

    let cipher = await elgamal.encrypt(m);
    
    let schnorr = new Schnorr(elgamal);

    let cryptoInfo = elgamal.export(true);
    let secret = cryptoInfo.r;

    //log('secret: ', secret);

    let proof = await schnorr.prove(secret, cipher.c1);

    //log('proof: ', proof);

    let result = schnorr.verify(cipher.c1, proof);

    log('result: ', result);
}

test();