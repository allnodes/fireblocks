import { Assets } from '@allnodes/fireblocks-core';
import { submitTransaction } from './submit-transaction';
import type { WithApi, WithFireblocks } from './types';

/**
 *
 */
export interface ApproveDto {
  address: string;
}

/**
 *
 * @param payload
 */
export async function approve(payload: WithApi<WithFireblocks<ApproveDto>>): Promise<void> {
  const { apiStaking, bridge, address } = payload;
  const transactionParams = await apiStaking.approve({ address, asset: Assets.MATIC });

  await submitTransaction({ bridge, address, transactionParams });
}