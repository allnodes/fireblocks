import type { WithGot } from '@allnodes/fireblocks-core';
import type { Utxo } from './types';

/**
 *
 */
export interface AddressInfoDto {
  address: string;
}

/**
 *
 */
export interface AddressInfoEntity {
  balance: number;
  utxo: Utxo[];
}

/**
 *
 * @param payload
 */
export async function fetchAddressInfo(payload: WithGot<AddressInfoDto>): Promise<AddressInfoEntity> {
  return payload.got.get(`utxo/${payload.address}`).json<AddressInfoEntity>();
}
