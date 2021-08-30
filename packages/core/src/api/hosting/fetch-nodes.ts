import type { NodeEntity, WithGot } from '../types';

/**
 *
 * @param payload
 */
export async function fetchNodes(payload: WithGot<{}>): Promise<Array<NodeEntity>> {
  return payload.got.get(``).json<Array<NodeEntity>>();
}
