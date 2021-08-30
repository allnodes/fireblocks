import type { Got } from 'got';
import got from 'got';
import { parseHttpError } from '../parse-http-error';
import type { NodeEntity } from '../types';
import type { HostingStateDto, HostingStateEntity } from './fetch-hosting-state';
import { fetchHostingState } from './fetch-hosting-state';
import { fetchNodes } from './fetch-nodes';
import type { UtxoDto, UtxoEntity } from './fetch-utxo';
import { fetchUtxo } from './fetch-utxo';
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
   */
  async fetchNodes(): Promise<Array<NodeEntity>> {
    try {
      return await fetchNodes({ got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
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

  /**
   *
   * @param payload
   */
  async fetchUtxo(payload: UtxoDto): Promise<Array<UtxoEntity>> {
    try {
      return await fetchUtxo({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }

  async fetchHostingState(payload: HostingStateDto): Promise<HostingStateEntity> {
    try {
      return await fetchHostingState({ ...payload, got: this.got });
    } catch (err) {
      throw parseHttpError(err);
    }
  }
}
