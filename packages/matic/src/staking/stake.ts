import { Assets } from '@allnodes/fireblocks-core';
import { submitTransaction } from './submit-transaction';
import type { WithApi, WithBridge } from './types';

/**
 *
 */
export interface StakeDto {
  address: string;
  validatorAddress: string;
  amount: string | number;
}

/**
 *
 * @param payload
 */
export async function stake(payload: WithApi<WithBridge<StakeDto>>): Promise<void> {
  const { apiStaking, bridge, address, amount } = payload;
  const transactionParams = await apiStaking.stake({ address, asset: Assets.MATIC, amount });

  if (__DEV__) {
    const gasPrice = transactionParams.gasPrice / 1e9;
    const { gasLimit } = transactionParams;
    const maxFee = Number(gasPrice * gasLimit).toFixed(8);

    console.log(`Delegating MATIC token: max fee = "${Number(maxFee)} ETH"`);
  }

  await submitTransaction({
    bridge,
    address,
    transactionParams: { ...transactionParams, toAddress: payload.validatorAddress },
  });

  if (__DEV__) {
    console.log(`Successfully staked MATIC`);
  }
}
