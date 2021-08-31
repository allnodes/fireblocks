import { parseHttpError } from '@allnodes/fireblocks-core';
import type { Got } from 'got';
import got from 'got';
import type { AddressInfoDto, AddressInfoEntity } from './fetch-address-info';
import { fetchAddressInfo } from './fetch-address-info';
import type { IndexerDto, IndexerEntity } from './fetch-indexer';
import { fetchIndexer } from './fetch-indexer';

/**
 *
 */
export class AllnodesApiGRT {
  /**
   *
   * @private
   */
  private readonly got: Got;

  /**
   *
   * @param baseUrl
   */
  constructor(baseUrl: string = 'https://www.allnodes.com/api/v2/grt') {
    this.got = got.extend({ prefixUrl: baseUrl });
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
   * @param payload
   */
  async fetchIndexer(payload: IndexerDto): Promise<IndexerEntity> {
    try {
      return await fetchIndexer({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }
}
