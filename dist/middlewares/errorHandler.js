"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, _, response, next) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    response.status(status).send({
        status,
        message,
    });
    next;
}
exports.default = errorMiddleware;
