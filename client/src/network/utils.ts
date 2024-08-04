export class NetworkError extends Error {
  /**
   * Custom error class representing network-related errors.
   * Extends the built-in Error class.
   */
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

const checkResponse = (response: Response, throwError: boolean = true) => {
  /**
   * Checks the network response for success and throws a NetworkError if it fails.
   *
   * @param {Response} response - The network response object to be checked.
   * @param {boolean} [throwError=true] - Flag indicating whether to throw an error on non-successful response (defaults to true).
   * @throws {NetworkError} - Throws a NetworkError if the response status is not 200 and throwError is true.
   */
  const message = JSON.stringify({
    status: response.status,
    text: response.statusText,
  });

  if (throwError && response.status !== 200) {
    throw new NetworkError(message);
  }
};

export const network = {
  checkResponse,
};
