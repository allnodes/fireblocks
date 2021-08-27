import * as Cardano from '@emurgo/cardano-serialization-lib-nodejs';

/**
 *
 */
export interface BaseAddress {
  publicKey: Cardano.PublicKey;
  credential: Cardano.StakeCredential;
  address: Cardano.BaseAddress;
}

/**
 *
 */
export interface StakeAddress {
  publicKey: Cardano.PublicKey;
  credential: Cardano.StakeCredential;
  address: Cardano.RewardAddress;
}

/**
 *
 */
export interface Addresses {
  baseAddress: BaseAddress;
  stakeAddress: StakeAddress;
}
