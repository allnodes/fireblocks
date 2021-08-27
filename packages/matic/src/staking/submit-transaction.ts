import type { EthereumTransactionParams } from '@allnodes/fireblocks-core';
import { Chain, Web3Bridge } from 'fireblocks-defi-sdk';

/**
 *
 */
interface Payload {
  bridge: Web3Bridge;
  address: string;
  transactionParams: EthereumTransactionParams;
}

/**
 *
 * @param payload
 */
export async function submitTransaction(payload: Payload): Promise<void> {
  const { id: transactionId } = await payload.bridge.sendTransaction({
    from: payload.address,
    to: payload.transactionParams.toAddress,
    value: payload.transactionParams.amount,
    gas: payload.transactionParams.gasLimit,
    gasPrice: payload.transactionParams.gasPrice * 1e9,
    data: payload.transactionParams.data,
    chain: Chain.MAINNET,
  });

  if (__DEV__) {
    console.log(`Sent Fireblocks transaction: id = "${transactionId}"`);
  }

  const hash = await payload.bridge.waitForTxHash(transactionId);

  if (__DEV__) {
    console.log(`Transaction ID = "${hash}"`);
    console.log('Successfully staked MATIC');
  }
}
