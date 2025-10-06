// Simple AES-GCM helpers using Web Crypto. Not secure key mgmt; MVP demo only.
export async function getKey(): Promise<CryptoKey> {
  const existing = localStorage.getItem('bg-key');
  if (existing) {
    const raw = Uint8Array.from(atob(existing), c => c.charCodeAt(0)).buffer;
    return await crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt','decrypt']);
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt','decrypt']);
  const raw = await crypto.subtle.exportKey('raw', key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  localStorage.setItem('bg-key', b64);
  return key;
}
export async function encrypt(text: string) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
  const ivb64 = btoa(String.fromCharCode(...iv));
  const ctb64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return { cipherText: ctb64, iv: ivb64 };
}
export async function decrypt(cipherText: string, ivb64: string) {
  try {
    const key = await getKey();
    const iv = Uint8Array.from(atob(ivb64), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
    const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return new TextDecoder().decode(buf);
  } catch {
    return '[decryption failed]';
  }
}
