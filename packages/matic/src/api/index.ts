import { parseHttpError } from '@allnodes/fireblocks-core';
import type { Got } from 'got';
import got from 'got';
import type { AddressInfoDto, AddressInfoEntity } from './fetch-address-info';
import { fetchAddressInfo } from './fetch-address-info';
import type { ValidatorDto, ValidatorEntity } from './fetch-validator';
import { fetchValidator } from './fetch-validator';

/**
 *
 */
export class AllnodesApiMATIC {
  /**
   *
   * @private
   */
  private readonly got: Got;

  /**
   *
   * @param baseUrl
   */
  constructor(baseUrl: string = 'https://www.allnodes.com/api/v2/matic') {
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
  async fetchValidator(payload: ValidatorDto): Promise<ValidatorEntity> {
    try {
      return await fetchValidator({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }
}
