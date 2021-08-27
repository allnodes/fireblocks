import type { TransactionArguments, TransactionResponse } from 'fireblocks-sdk';
import { FireblocksSDK } from 'fireblocks-sdk';
import invariant from 'tiny-invariant';
import { TRANSACTION_FAILURE_STATUSES, TRANSACTION_SUCCESS_STATUSES } from './constants';
import { sleep } from './sleep';

/**
 *
 */
interface Payload {
  transactionArguments: TransactionArguments;
  fireblocks: FireblocksSDK;
}

/**
 *
 * @param payload
 */
export async function submitTransaction(payload: Payload): Promise<TransactionResponse> {
  const { id: transactionId } = await payload.fireblocks.createTransaction(payload.transactionArguments);

  if (__DEV__) {
    console.log(`Sent Fireblocks transaction: id = "${transactionId}"`);
  }

  for (;;) {
    await sleep(1000);

    const transaction = await payload.fireblocks.getTransactionById(transactionId);
    const { status, subStatus } = transaction;

    if (TRANSACTION_SUCCESS_STATUSES.includes(status)) {
      if (__DEV__) {
        console.log(`Successfully submitted Fireblocks transaction: id = "${transactionId}"`);
      }

      return transaction;
    }

    invariant(
      !TRANSACTION_FAILURE_STATUSES.includes(status),
      `Failed Fireblocks transaction: id = "${transactionId}", status = "${status}", subStatus = "${subStatus}"`
    );
  }
}
