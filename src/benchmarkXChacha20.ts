import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { randomBytes } from "@noble/ciphers/webcrypto";
import sodium from "libsodium-wrappers";
import { benchmark } from "./benchmark.js";
import {
  oneHundredKiloBytes,
  oneKiloByte,
  oneMegaByte,
  tenBytes,
} from "./data";
const key = randomBytes(32);
const nonce = randomBytes(24);

export const benchmarkXChacha20 = async () => {
  await sodium.ready;

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "10 Bytes",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      const ciphertext = chacha.encrypt(tenBytes);
    },
    libsodiumCallback: () => {
      const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        tenBytes,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 2000,
  });

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "1 KB",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      const ciphertext = chacha.encrypt(oneKiloByte);
    },
    libsodiumCallback: () => {
      const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        oneKiloByte,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 1000,
  });

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "100 KB",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      const ciphertext = chacha.encrypt(oneHundredKiloBytes);
    },
    libsodiumCallback: () => {
      const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        oneHundredKiloBytes,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 100,
  });

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "1 MB",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      const ciphertext = chacha.encrypt(oneMegaByte);
    },
    libsodiumCallback: () => {
      const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        oneMegaByte,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 10,
  });
};
