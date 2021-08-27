/**
 *
 */
declare const __DEV__: boolean;

/**
 *
 */
declare module 'bitcore-lib' {
  export default {
    encoding: {
      BufferWriter: {
        varintBufNum(payload: number): Buffer {},
      },
    },
    crypto: {
      Hash: {
        sha256sha256(payload: Buffer): Buffer {},
      },
    },
  };
}
