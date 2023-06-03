import { CourierClient } from "@trycourier/courier";

const courier = CourierClient({
  authorizationToken: process.env.COURIER_AUTH_TOKEN,
});

export { courier };
