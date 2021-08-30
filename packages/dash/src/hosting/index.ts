import type { NodeEntity } from '@allnodes/fireblocks-core';
import { AllnodesApiHosting, Assets } from '@allnodes/fireblocks-core';
import { FireblocksSDK } from 'fireblocks-sdk';
import { AllnodesSignerDASH } from '../signer';
import type { Utxo } from './types';

/**
 *
 */
export class AllnodesHostingDASH {
  /**
   *
   * @private
   */
  private signerDASH: AllnodesSignerDASH;

  /**
   *
   * @private
   */
  private readonly apiHosting: AllnodesApiHosting;

  /**
   *
   * @param apiKey
   * @param fireblocks
   * @param vaultAccountId
   */
  constructor(apiKey: string, fireblocks: FireblocksSDK, vaultAccountId: string) {
    this.signerDASH = new AllnodesSignerDASH(fireblocks, vaultAccountId);
    this.apiHosting = new AllnodesApiHosting(apiKey);
  }

  /**
   *
   * @param payload
   */
  async hostNode(payload: { utxo: Utxo; nodeName?: string }): Promise<NodeEntity> {
    return this.apiHosting.hostNode({ asset: Assets.DASH, collateral: payload.utxo, nodeName: payload.nodeName });
  }

  /**
   *
   * @param payload
   */
  async activateNode(payload: { node: NodeEntity; addressIndex: number; payeeAddress?: string }): Promise<string> {
    const { id } = payload.node;
    const { payeeAddress, addressIndex } = payload;
    const { tx, signMessage } = await this.apiHosting.protxRegisterPrepare({ id, payeeAddress });

    if (__DEV__) {
      console.log(`Prepared data for ProTx transaction: node id = "${id}", sign message = "${signMessage}"`);
    }

    const signature = await this.signerDASH.signMessage({ message: signMessage, addressIndex });

    if (__DEV__) {
      console.log(`Successfully signed ProTx message: node id = "${id}", signature = "${signature}"`);
    }

    const { hash } = await this.apiHosting.protxRegisterSubmit({ id, tx, signature });

    if (__DEV__) {
      console.log(`Successfully submitted ProTx transaction: node id = "${id}", hash = "${hash}"`);
    }

    return hash;
  }
}
