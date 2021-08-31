import { Assets } from '@allnodes/fireblocks-core';
import { submitTransaction } from './submit-transaction';
import type { WithApi, WithBridge } from './types';

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
export async function approve(payload: WithApi<WithBridge<ApproveDto>>): Promise<void> {
  const { apiStaking, bridge, address } = payload;
  const transactionParams = await apiStaking.approve({ address, asset: Assets.SHIB });

  if (__DEV__) {
    const gasPrice = transactionParams.gasPrice / 1e9;
    const { gasLimit } = transactionParams;
    const maxFee = Number(gasPrice * gasLimit).toFixed(8);

    console.log(`Approving SHIB token: max fee = "${Number(maxFee)} ETH"`);
  }

  await submitTransaction({ bridge, address, transactionParams });

  if (__DEV__) {
    console.log(`Successfully approved SHIB token`);
  }
}
