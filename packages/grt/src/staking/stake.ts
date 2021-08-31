import { Assets } from '@allnodes/fireblocks-core';
import { submitTransaction } from './submit-transaction';
import type { WithApi, WithBridge } from './types';

/**
 *
 */
export interface StakeDto {
  address: string;
  amount: string | number;
  indexerAddress: string
}

/**
 *
 * @param payload
 */
export async function stake(payload: WithApi<WithBridge<StakeDto>>): Promise<void> {
  const { apiStaking, bridge, address, amount, indexerAddress: toAddress } = payload;
  const transactionParams = await apiStaking.stake({ address, asset: Assets.GRT, amount, toAddress });

  if (__DEV__) {
    const gasPrice = transactionParams.gasPrice / 1e9;
    const { gasLimit } = transactionParams;
    const maxFee = Number(gasPrice * gasLimit).toFixed(8);

    console.log(`Delegating GRT token: max fee = "${Number(maxFee)} ETH"`);
  }

  await submitTransaction({ bridge, address, transactionParams, });

  if (__DEV__) {
    console.log(`Successfully staked GRT`);
  }
}
