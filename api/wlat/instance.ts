import { WlatEngine } from "./engine";
import { getStore } from "./store/memory";

const secrets = {
  appSecret: process.env.APP_SECRET || "wlat-dev-secret",
  mappingHmac: process.env.WLAT_MAPPING_HMAC || process.env.APP_SECRET || "wlat-map-hmac",
};

let engine: WlatEngine | null = null;

export function getEngine(): WlatEngine {
  if (!engine) {
    engine = new WlatEngine(getStore(), secrets);
  }
  return engine;
}

export function mappingHmac(): string {
  return secrets.mappingHmac;
}
