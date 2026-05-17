export class HttpError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const notFound = (entity = "Resource") =>
  new HttpError(404, `${entity} not found`);

export const badRequest = (message, errors = null) =>
  new HttpError(400, message, errors);

export const unauthorized = (message = "Unauthorized") =>
  new HttpError(401, message);

export const forbidden = (message = "Forbidden") =>
  new HttpError(403, message);
