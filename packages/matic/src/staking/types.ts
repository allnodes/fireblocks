import { AllnodesApiStaking } from '@allnodes/fireblocks-core';
import { Web3Bridge } from 'fireblocks-defi-sdk';

/**
 *
 */
export type WithBridge<T> = T & { bridge: Web3Bridge };

/**
 *
 */
export type WithApi<T> = T & { apiStaking: AllnodesApiStaking };
