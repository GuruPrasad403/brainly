enum HttpStatus {
    // 2xx Success
    OK = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
  
    // 3xx Redirection
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
  
    // 4xx Client Errors
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    PayloadTooLarge = 413,
    UnsupportedMediaType = 415,
    TooManyRequests = 429,
  
    // 5xx Server Errors
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
        ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505
  }

  enum ApiStatus {
    Success = 'SUCCESS',
    Error = 'ERROR',
    Warning = 'WARNING',
    Info = 'INFO'
  }
  enum ErrorType {
    Validation = 'VALIDATION_ERROR',
    Database = 'DATABASE_ERROR',
    Network = 'NETWORK_ERROR',
    Authentication = 'AUTH_ERROR',
    Authorization = 'AUTHZ_ERROR'
  }
  class HttpError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name; // Optional, useful for debugging
    }
  }

  export {ErrorType,ApiStatus,HttpStatus,HttpError}