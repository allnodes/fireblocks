import { TransactionStatus } from 'fireblocks-sdk';

/**
 *
 */
export const TRANSACTION_SUCCESS_STATUSES = [TransactionStatus.COMPLETED];

/**
 *
 */
export const TRANSACTION_FAILURE_STATUSES = [
  TransactionStatus.BLOCKED,
  TransactionStatus.FAILED,
  TransactionStatus.REJECTED,
  TransactionStatus.CANCELLED,
];
