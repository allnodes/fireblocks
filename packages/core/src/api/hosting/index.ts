import type { Got } from 'got';
import got from 'got';
import type { NodeEntity } from '../types';
import { parseHttpError } from '../parse-http-error';
import type { HostNodeDto } from './host-node';
import { hostNode } from './host-node';
import type { ProtxRegisterPrepareDto, ProtxRegisterPrepareResponse } from './protx-register-prepare';
import { protxRegisterPrepare } from './protx-register-prepare';
import type { ProtxRegisterSubmitDto, ProtxRegisterSubmitResponse } from './protx-register-submit';
import { protxRegisterSubmit } from './protx-register-submit';

/**
 *
 */
export class AllnodesApiHosting {
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
  constructor(apiKey: string, baseUrl: string = 'https://www.allnodes.com/api/v1/node') {
    this.got = got.extend({
      prefixUrl: baseUrl,
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  }

  /**
   *
   * @param payload
   */
  async hostNode(payload: HostNodeDto): Promise<NodeEntity> {
    try {
      return await hostNode({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }

  /**
   *
   * @param payload
   */
  async protxRegisterPrepare(payload: ProtxRegisterPrepareDto): Promise<ProtxRegisterPrepareResponse> {
    try {
      return await protxRegisterPrepare({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }

  /**
   *
   * @param payload
   */
  async protxRegisterSubmit(payload: ProtxRegisterSubmitDto): Promise<ProtxRegisterSubmitResponse> {
    try {
      return await protxRegisterSubmit({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }
}
