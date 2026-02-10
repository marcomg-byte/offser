import { vi } from 'vitest';
import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';

/**
 * Creates a mock server object with a mocked close method.
 *
 * @param closeMock - A vi.fn() mock function to use as the server's close method.
 * @returns An object mimicking http.Server or https.Server with the mocked close method.
 */
function createMockServer(
  closeMock: ReturnType<typeof vi.fn>,
): HTTPServer | HTTPSServer {
  return {
    close: closeMock,
  } as unknown as HTTPServer | HTTPSServer;
}

/**
 * Creates a mock implementation of the server's close method.
 * The returned mock will invoke the provided callback with an optional error,
 * simulating the behavior of http.Server/https.Server.close.
 *
 * @param mockServer - The mock server instance to return from the close method.
 * @param error - Optional error to pass to the callback, simulating a close failure.
 * @returns A vi.fn() mock function for the close method.
 */
function createCloseMock(mockServer: HTTPServer | HTTPSServer, error?: Error) {
  return vi.fn((callback: (error?: Error) => void) => {
    callback(error);
    return mockServer;
  });
}

export { createMockServer, createCloseMock };
