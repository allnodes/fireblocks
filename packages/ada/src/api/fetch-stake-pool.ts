import type { WithGot } from '@allnodes/fireblocks-core';

/**
 *
 */
export interface StakePoolDto {
  address: string;
}

/**
 *
 */
export interface StakePoolEntity {
  hash: string;
  id: string;
  name: string;
  ticker: string;
}

/**
 *
 * @param payload
 */
export async function fetchStakePool(payload: WithGot<StakePoolDto>): Promise<StakePoolEntity> {
  return payload.got.get(`pool/${payload.address}`).json<StakePoolEntity>();
}
