import { describe, it, expect, vi, afterEach } from 'vitest';
import { existsSync, mkdirSync } from 'fs';

vi.mock('fs', () => {
  const existsSync = vi.fn();
  const mkdirSync = vi.fn();
  const createWriteStream = vi.fn(() => ({
    on: vi.fn(),
    write: vi.fn(),
    end: vi.fn(),
  }));

  return {
    existsSync,
    mkdirSync,
    createWriteStream,
    default: {
      existsSync,
      mkdirSync,
      createWriteStream,
    },
  };
});

describe('logger.util.ts', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create logs directory if it does not exist', async () => {
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(mkdirSync).mockImplementation(() => undefined);

    await import('./logger.util.js');

    expect(existsSync).toHaveBeenCalledWith('./logs');
    expect(mkdirSync).toHaveBeenCalledWith('./logs', { recursive: true });
  });
});
