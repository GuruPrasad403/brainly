"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.HttpStatus = exports.ApiStatus = exports.ErrorType = void 0;
var HttpStatus;
(function (HttpStatus) {
    // 2xx Success
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["Created"] = 201] = "Created";
    HttpStatus[HttpStatus["Accepted"] = 202] = "Accepted";
    HttpStatus[HttpStatus["NoContent"] = 204] = "NoContent";
    HttpStatus[HttpStatus["ResetContent"] = 205] = "ResetContent";
    HttpStatus[HttpStatus["PartialContent"] = 206] = "PartialContent";
    // 3xx Redirection
    HttpStatus[HttpStatus["MultipleChoices"] = 300] = "MultipleChoices";
    HttpStatus[HttpStatus["MovedPermanently"] = 301] = "MovedPermanently";
    HttpStatus[HttpStatus["Found"] = 302] = "Found";
    HttpStatus[HttpStatus["SeeOther"] = 303] = "SeeOther";
    HttpStatus[HttpStatus["NotModified"] = 304] = "NotModified";
    HttpStatus[HttpStatus["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpStatus[HttpStatus["PermanentRedirect"] = 308] = "PermanentRedirect";
    // 4xx Client Errors
    HttpStatus[HttpStatus["BadRequest"] = 400] = "BadRequest";
    HttpStatus[HttpStatus["Unauthorized"] = 401] = "Unauthorized";
    HttpStatus[HttpStatus["Forbidden"] = 403] = "Forbidden";
    HttpStatus[HttpStatus["NotFound"] = 404] = "NotFound";
    HttpStatus[HttpStatus["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpStatus[HttpStatus["NotAcceptable"] = 406] = "NotAcceptable";
    HttpStatus[HttpStatus["RequestTimeout"] = 408] = "RequestTimeout";
    HttpStatus[HttpStatus["Conflict"] = 409] = "Conflict";
    HttpStatus[HttpStatus["Gone"] = 410] = "Gone";
    HttpStatus[HttpStatus["PayloadTooLarge"] = 413] = "PayloadTooLarge";
    HttpStatus[HttpStatus["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    HttpStatus[HttpStatus["TooManyRequests"] = 429] = "TooManyRequests";
    // 5xx Server Errors
    HttpStatus[HttpStatus["InternalServerError"] = 500] = "InternalServerError";
    HttpStatus[HttpStatus["NotImplemented"] = 501] = "NotImplemented";
    HttpStatus[HttpStatus["BadGateway"] = 502] = "BadGateway";
    HttpStatus[HttpStatus["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpStatus[HttpStatus["GatewayTimeout"] = 504] = "GatewayTimeout";
    HttpStatus[HttpStatus["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
var ApiStatus;
(function (ApiStatus) {
    ApiStatus["Success"] = "SUCCESS";
    ApiStatus["Error"] = "ERROR";
    ApiStatus["Warning"] = "WARNING";
    ApiStatus["Info"] = "INFO";
})(ApiStatus || (exports.ApiStatus = ApiStatus = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["Validation"] = "VALIDATION_ERROR";
    ErrorType["Database"] = "DATABASE_ERROR";
    ErrorType["Network"] = "NETWORK_ERROR";
    ErrorType["Authentication"] = "AUTH_ERROR";
    ErrorType["Authorization"] = "AUTHZ_ERROR";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name; // Optional, useful for debugging
    }
}
exports.HttpError = HttpError;
