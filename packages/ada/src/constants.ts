import * as Cardano from '@emurgo/cardano-serialization-lib-nodejs';

/**
 *
 */
export const POOL_HASH = Buffer.from(`6f223af7c6069f7428cf7605efba84ec410f5476550f83dbb3096238`, 'hex');

/**
 *
 */
export const NETWORK_ID = 0x01;

/**
 *
 */
export const PROTOCOL_MAGIC = 764824073;

/**
 *
 */
export const MIN_FEE_STATIC = Cardano.BigNum.from_str('155381');

/**
 *
 */
export const MIN_FEE_DYNAMIC = Cardano.BigNum.from_str('44');

/**
 *
 */
export const MIN_UTXO_VALUE = Cardano.BigNum.from_str('1000000');

/**
 *
 */
export const POOL_DEPOSIT = Cardano.BigNum.from_str('500000000');

/**
 *
 */
export const KEY_DEPOSIT = Cardano.BigNum.from_str('2000000');

/**
 *
 */
export const TTL_OFFSET = 7200;
