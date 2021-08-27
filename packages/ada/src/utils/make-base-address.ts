import * as Cardano from '@emurgo/cardano-serialization-lib-nodejs';
import * as Constants from '../constants';
import type { BaseAddress } from '../types';

/**
 *
 */
interface Payload {
  publicKey: string;
  stakeCredential: Cardano.StakeCredential;
}


/**
 *
 * @param payload
 */
export function makeBaseAddress(payload: Payload): BaseAddress {
  const publicKey = Cardano.PublicKey.from_bytes(Buffer.from(payload.publicKey, 'hex'));
  const credential = Cardano.StakeCredential.from_keyhash(publicKey.hash());
  const address = Cardano.BaseAddress.new(Constants.NETWORK_ID, credential, payload.stakeCredential);

  return { publicKey, credential, address };
}
