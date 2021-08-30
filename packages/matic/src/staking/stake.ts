import { Assets } from '@allnodes/fireblocks-core';
import { submitTransaction } from './submit-transaction';
import type { WithApi, WithBridge } from './types';

/**
 *
 */
export interface StakeDto {
  address: string;
  amount: string | number;
}

/**
 *
 * @param payload
 */
export async function stake(payload: WithApi<WithBridge<StakeDto>>): Promise<void> {
  const { apiStaking, bridge, address, amount } = payload;
  const transactionParams = await apiStaking.stake({ address, asset: Assets.MATIC, amount });

  await submitTransaction({ bridge, address, transactionParams });
}
