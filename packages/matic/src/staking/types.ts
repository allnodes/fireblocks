import { AllnodesApiStaking } from '@allnodes/fireblocks-core';
import { Web3Bridge } from 'fireblocks-defi-sdk';
import { FireblocksSDK } from 'fireblocks-sdk';

/**
 *
 */
export type WithFireblocks<T> = T & { fireblocks: FireblocksSDK; vaultAccountId: string; bridge: Web3Bridge };

/**
 *
 */
export type WithApi<T> = T & { apiStaking: AllnodesApiStaking };
