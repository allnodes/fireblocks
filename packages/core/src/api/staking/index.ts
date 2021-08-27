import type { Got } from 'got';
import got from 'got';
import type { EthereumTransactionParams } from '../types';
import { parseHttpError } from '../parse-http-error';
import type { ApproveDto } from './approve';
import { approve } from './approve';
import type { StakeDto } from './stake';
import { stake } from './stake';

/**
 *
 */
export class AllnodesApiStaking {
  /**
   *
   * @private
   */
  private readonly got: Got;

  /**
   *
   * @param apiKey
   * @param baseUrl
   */
  constructor(apiKey: string, baseUrl: string = 'https://www.allnodes.com/api/v1/staking') {
    this.got = got.extend({
      prefixUrl: baseUrl,
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  }

  /**
   *
   * @param payload
   */
  async approve(payload: ApproveDto): Promise<EthereumTransactionParams> {
    try {
      return await approve({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }

  /**
   *
   * @param payload
   */
  async stake(payload: StakeDto): Promise<EthereumTransactionParams> {
    try {
      return await stake({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }
}
