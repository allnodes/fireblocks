import { parseHttpError } from '@allnodes/fireblocks-core';
import type { Got } from 'got';
import got from 'got';
import type { BroadcastTransactionDto } from './broadcast-transaction';
import { broadcastTransaction } from './broadcast-transaction';
import type { AddressInfoDto, AddressInfoEntity } from './fetch-address-info';
import { fetchAddressInfo } from './fetch-address-info';
import type { Tip } from './fetch-tip';
import { fetchTip } from './fetch-tip';

/**
 *
 */
export class AllnodesApiADA {
  /**
   *
   * @private
   */
  private readonly got: Got;

  /**
   *
   * @param baseUrl
   */
  constructor(baseUrl: string = 'https://www.allnodes.com/api/v2/ada') {
    this.got = got.extend({ prefixUrl: baseUrl });
  }

  /**
   *
   * @param payload
   */
  async broadcastTransaction(payload: BroadcastTransactionDto): Promise<void> {
    try {
      await broadcastTransaction({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }

  /**
   *
   * @param payload
   */
  async fetchAddressInfo(payload: AddressInfoDto): Promise<AddressInfoEntity> {
    try {
      return await fetchAddressInfo({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }

  /**
   *
   */
  async fetchTip(): Promise<Tip> {
    try {
      return await fetchTip({ got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }
}
