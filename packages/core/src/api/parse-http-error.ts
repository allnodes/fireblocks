import { HTTPError } from 'got';

/**
 *
 * @param err
 */
export function parseHttpError(err: unknown) {
  if (err instanceof HTTPError) {
    const message = parseHttpErrorMessage(err);

    if (message) {
      return new Error(message);
    }
  }

  return err;
}

/**
 *
 * @param err
 */
function parseHttpErrorMessage(err: HTTPError): string | null {
  try {
    const { body } = err.response;
    const { error: message } = JSON.parse(body as string);

    if (typeof message === 'string') {
      return message;
    }
  } catch {}

  return null;
}
