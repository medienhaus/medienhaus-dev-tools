//Utils

/**
 * Handles retrying a function when encountering a rate limiting error (HTTP 429) from matrix.
 *
 * @param {Object} error - The error object, typically containing an HTTP status code and additional data.
 * @param {Function} retryFunction - The function to retry after a delay in case of a rate limiting error.
 * @returns {Promise<*>} - A Promise that resolves with the result of the retryFunction.
 *
 * @throws {Error} - Throws an error if `error` is falsy or does not have an `httpStatus` property.
 */
export async function handleMatrixRateLimit(error, retryFunction) {
    // Handle other errors
    if (error.httpStatus !== 429) throw new Error(error.data.error || 'Something went wrong. Please try again.');
    // Handle rate limiting with retry_after_ms
    const retryAfterMs = error.data['retry_after_ms'] || 5000;
    console.debug('Retry after (ms):', retryAfterMs);

    // Retry the function after the specified delay, defaults to 5000ms
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));

    return retryFunction();
}

/**
 * Removes all trailing slashes from a string, if present.
 *
 * @param {string} string - The URL string to be checked and modified.
 * @returns {string} - The modified URL string without trailing slashes.
 */
export function removeTrailingSlash(string) {
    return string.replace(/\/+$/, '');
}
