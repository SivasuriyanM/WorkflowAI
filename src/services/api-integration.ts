/**
 * Represents authentication information for an API.
 */
export interface ApiAuthentication {
  /**
   * The authentication type (e.g., OAuth 2.0, API Key, JWT).
   */
  type: string;
  /**
   * The authentication credentials or tokens.
   */
  credentials: Record<string, string>;
}

/**
 * Represents the configuration for an API connection.
 */
export interface ApiConnectionConfig {
  /**
   * The base URL of the API.
   */
  baseUrl: string;
  /**
   * The authentication details for the API.
   */
  authentication?: ApiAuthentication;
}

/**
 * Represents a generic data object returned by an API.
 */
export interface ApiData {
  [key: string]: any;
}

/**
 * Establishes a connection to a third-party application using the provided API configuration.
 *
 * @param config The configuration required to connect to the API.
 * @returns A promise that resolves to indicate a successful connection. Throws an error if the connection fails.
 */
export async function connectToApi(config: ApiConnectionConfig): Promise<void> {
  // TODO: Implement this function by calling an API.
  console.log(`Connecting to API with base URL: ${config.baseUrl}`);

  return Promise.resolve();
}

/**
 * Sends a request to a third-party API.
 *
 * @param config The configuration for the API connection.
 * @param endpoint The specific API endpoint to call.
 * @param method The HTTP method to use (e.g., GET, POST, PUT, DELETE).
 * @param data The data to send in the request body (for POST, PUT, etc.).
 * @returns A promise that resolves to the data returned by the API.
 */
export async function callApi(
  config: ApiConnectionConfig,
  endpoint: string,
  method: string,
  data?: any
): Promise<ApiData> {
  // TODO: Implement this function by calling an API.
  console.log(
    `Calling API: ${config.baseUrl}${endpoint} with method ${method}`
  );

  return { message: 'API call successful', data: {} };
}
