"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courier = void 0;
const courier_1 = require("@trycourier/courier");
const courier = (0, courier_1.CourierClient)({
    authorizationToken: process.env.COURIER_AUTH_TOKEN,
});
exports.courier = courier;
//# sourceMappingURL=courier.js.map