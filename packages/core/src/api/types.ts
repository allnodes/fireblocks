import type { Got } from 'got';
import { Assets } from '../assets';

/**
 *
 */
export type WithGot<T> = T & { got: Got };

/**
 *
 */
export interface NodeEntity {
  id: string;
  ip: string;
  name: string;
  currencySymbol: Assets;
  createdAt: string;
  instance: {
    version: string;
    status: string;
    uptimeSeconds: number | null;
    lastSeenAt: string | null;
  };
  address: {
    collateralAddress: string;
    collateralHash: string;
    collateralIndex: number;
    payeeAddress: string;
    balanceAmount: number;
    rewardsEarned: number;
    lastRewardAt: string | null;
  };
  settings: {
    walletType: string | null;
  };
}

/**
 *
 */
export interface EthereumTransactionParams {
  network: 'mainnet';
  toAddress: string;
  amount: string;
  gasLimit: number;
  gasPrice: number;
  data: string;
}
