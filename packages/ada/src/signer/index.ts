import { Assets, submitTransaction } from '@allnodes/fireblocks-core';
import type { RawMessageData, TransactionArguments } from 'fireblocks-sdk';
import { FireblocksSDK, PeerType, TransactionOperation } from 'fireblocks-sdk';
import invariant from 'tiny-invariant';

/**
 *
 */
export class AllnodesSignerADA {
  /**
   *
   * @param fireblocks
   * @param vaultAccountId
   */
  constructor(private readonly fireblocks: FireblocksSDK, private readonly vaultAccountId: string) {}

  /**
   *
   * @param payload
   */
  async signMessage(payload: { message: string; change: number; addressIndex?: number }): Promise<string> {
    const rawMessageData: RawMessageData = {
      messages: [
        { content: payload.message, bip44change: payload.change, bip44addressIndex: payload?.addressIndex ?? 0 },
      ],
    };

    const transactionArguments: TransactionArguments = {
      operation: TransactionOperation.RAW,
      assetId: Assets.ADA,
      source: { type: PeerType.VAULT_ACCOUNT, id: this.vaultAccountId },
      extraParameters: { rawMessageData },
    };

    const transaction = await submitTransaction({ transactionArguments, fireblocks: this.fireblocks });

    invariant(transaction.signedMessages?.[0], `Failed to parse Fireblocks signature`);

    return transaction.signedMessages[0].signature.fullSig;
  }
}
