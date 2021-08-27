import { Chain, Web3Bridge } from 'fireblocks-defi-sdk';
import { FireblocksSDK } from 'fireblocks-sdk';

/**
 *
 */
interface Payload {
  fireblocks: FireblocksSDK;
  vaultAccountId: string;
}

/**
 *
 * @param payload
 */
export function makeBridge(payload: Payload) {
  return new Web3Bridge({
    vaultAccountId: payload.vaultAccountId,
    fireblocksApiClient: payload.fireblocks,
    chain: Chain.MAINNET,
  });
}
