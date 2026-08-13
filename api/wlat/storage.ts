import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { sha256Hex } from "./domain/crypto";

const blobs = new Map<string, Uint8Array>();
const root = path.resolve(process.env.WLAT_STORAGE_DIR || "storage/wlat");

export async function putObject(key: string, bytes: Uint8Array): Promise<{ hash: string; key: string }> {
  blobs.set(key, bytes);
  try {
    const full = path.join(root, key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, bytes);
  } catch {
    // disk optional
  }
  return { hash: sha256Hex(Buffer.from(bytes)), key };
}

export async function getObject(key: string): Promise<Uint8Array | null> {
  if (blobs.has(key)) return blobs.get(key)!;
  try {
    return await readFile(path.join(root, key));
  } catch {
    return null;
  }
}
