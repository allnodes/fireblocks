import type { WithGot } from '@allnodes/fireblocks-core';

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
  balance: string;
  ethBalance: string;
}

/**
 *
 * @param payload
 */
export async function fetchAddressInfo(payload: WithGot<AddressInfoDto>): Promise<AddressInfoEntity> {
  return payload.got.get(`balance/${payload.address}`).json<AddressInfoEntity>();
}
