import * as Cardano from '@emurgo/cardano-serialization-lib-nodejs';
import * as Constants from '../constants';
import type { StakeAddress } from '../types';

/**
 *
 */
interface Payload {
  publicKey: string;
}

/**
 *
 * @param payload
 */
export function makeStakeAddress(payload: Payload): StakeAddress {
  const publicKey = Cardano.PublicKey.from_bytes(Buffer.from(payload.publicKey, 'hex'));
  const credential = Cardano.StakeCredential.from_keyhash(publicKey.hash());
  const address = Cardano.RewardAddress.new(Constants.NETWORK_ID, credential);

  return { publicKey, credential, address };
}
