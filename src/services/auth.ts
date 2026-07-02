import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/**
 * Local-first account system: a real user registry with salted password
 * hashes in AsyncStorage. The API is shaped like a remote client so a
 * backend can replace the storage layer without touching the screens.
 */

const USERS_KEY = 'noor-users';
const SALT = 'noor.app.v1';

interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

type Registry = Record<string, StoredUser>;

export type AuthResult =
  | { ok: true; name: string; email: string }
  | { ok: false; error: 'exists' | 'notFound' | 'wrongPassword' };

async function readRegistry(): Promise<Registry> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Registry) : {};
  } catch {
    return {};
  }
}

async function writeRegistry(registry: Registry): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(registry));
}

async function hashPassword(email: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${SALT}:${email}:${password}`
  );
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const key = normalizeEmail(email);
  const registry = await readRegistry();
  if (registry[key]) return { ok: false, error: 'exists' };
  const user: StoredUser = {
    name: name.trim(),
    email: key,
    passwordHash: await hashPassword(key, password),
    createdAt: Date.now(),
  };
  registry[key] = user;
  await writeRegistry(registry);
  return { ok: true, name: user.name, email: user.email };
}

export async function verifyUser(email: string, password: string): Promise<AuthResult> {
  const key = normalizeEmail(email);
  const registry = await readRegistry();
  const user = registry[key];
  if (!user) return { ok: false, error: 'notFound' };
  const hash = await hashPassword(key, password);
  if (hash !== user.passwordHash) return { ok: false, error: 'wrongPassword' };
  return { ok: true, name: user.name, email: user.email };
}
