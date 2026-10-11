import type { ErrorRequestHandler, RequestHandler } from 'express';

function isJsonParseError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { type?: unknown }).type === 'entity.parse.failed'
  );
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isJsonParseError(error)) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
};
