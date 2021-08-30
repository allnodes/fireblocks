import { Assets, submitTransaction } from '@allnodes/fireblocks-core';
import bitcore from 'bitcore-lib';
import type { RawMessageData, TransactionArguments, TransactionResponse } from 'fireblocks-sdk';
import { FireblocksSDK, PeerType, TransactionOperation } from 'fireblocks-sdk';
import invariant from 'tiny-invariant';
import { MESSAGE_MAGIC } from '../constants';

/**
 *
 */
export class AllnodesSignerDASH {
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
  async signMessage(payload: { message: string; addressIndex: number }): Promise<string> {
    const rawMessageData: RawMessageData = {
      messages: [
        { content: this.makeMessageHash({ message: payload.message }), bip44addressIndex: payload.addressIndex },
      ],
    };

    const transactionArguments: TransactionArguments = {
      operation: TransactionOperation.RAW,
      assetId: Assets.DASH,
      source: { type: PeerType.VAULT_ACCOUNT, id: this.vaultAccountId },
      extraParameters: { rawMessageData },
    };

    const transaction = await submitTransaction({ transactionArguments, fireblocks: this.fireblocks });

    return this.parseSignature(transaction);
  }

  /**
   *
   * @param payload
   */
  makeMessageHash(payload: { message: string }): string {
    const magicPrefix = bitcore.encoding.BufferWriter.varintBufNum(MESSAGE_MAGIC.length);
    const message = Buffer.from(payload.message);
    const messagePrefix = bitcore.encoding.BufferWriter.varintBufNum(message.length);
    const result = Buffer.concat([magicPrefix, MESSAGE_MAGIC, messagePrefix, message]);
    const hash = bitcore.crypto.Hash.sha256sha256(result);

    return hash.toString('hex');
  }

  /**
   *
   * @param transaction
   */
  parseSignature(transaction: TransactionResponse): string {
    invariant(transaction.signedMessages?.[0], `Failed to parse Fireblocks signature`);

    const { signature } = transaction.signedMessages[0];
    const { r, s } = signature;

    invariant(signature.v != null && r != null && s != null, `Failed to parse Fireblocks signature`);

    const v: number = signature.v + 27 + 4;

    return Buffer.from(v.toString(16) + r + s, 'hex').toString('base64');
  }
}
