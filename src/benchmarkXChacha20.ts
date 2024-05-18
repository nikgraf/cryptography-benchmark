import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { randomBytes } from "@noble/ciphers/webcrypto";
import sodium from "libsodium-wrappers";
import { benchmark } from "./benchmark.js";
import {
  getOneHundredKiloBytes,
  getOneKiloByte,
  getOneMegaByte,
  getTenBytes,
} from "./data";

export const benchmarkXChacha20 = async () => {
  await sodium.ready;

  const key = randomBytes(32);
  const nonce = randomBytes(24);
  const tenBytes = getTenBytes();
  const oneKiloByte = getOneKiloByte();
  const oneHundredKiloBytes = getOneHundredKiloBytes();
  const oneMegaByte = getOneMegaByte();

  benchmark({
    operation: "xchacha20poly1305 key generation (32byte",
    sourceName: "",
    nobleCallback: () => {
      randomBytes(32);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_keygen();
    },
    iterations: 5000,
  });

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "10 Bytes",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      chacha.encrypt(tenBytes);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        tenBytes,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 5000,
  });

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "1 KB",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      chacha.encrypt(oneKiloByte);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        oneKiloByte,
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
    sourceName: "100 KB",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      chacha.encrypt(oneHundredKiloBytes);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        oneHundredKiloBytes,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 200,
  });

  benchmark({
    operation: "xchacha20poly1305 encrypt",
    sourceName: "1 MB",
    nobleCallback: () => {
      const chacha = xchacha20poly1305(key, nonce);
      chacha.encrypt(oneMegaByte);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        oneMegaByte,
        null,
        null,
        nonce,
        key
      );
    },
    iterations: 20,
  });

  const chacha = xchacha20poly1305(key, nonce);
  const ciphertextTenBytes = chacha.encrypt(tenBytes);
  const ciphertextOneKiloByte = chacha.encrypt(oneKiloByte);
  const ciphertextOneHundredKiloBytes = chacha.encrypt(oneHundredKiloBytes);
  const ciphertextOneMegaByte = chacha.encrypt(oneMegaByte);

  benchmark({
    operation: "xchacha20poly1305 decrypt",
    sourceName: "10 Bytes",
    nobleCallback: () => {
      chacha.decrypt(ciphertextTenBytes);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertextTenBytes,
        null,
        nonce,
        key
      );
    },
    iterations: 10000,
  });

  benchmark({
    operation: "xchacha20poly1305 decrypt",
    sourceName: "1 KB",
    nobleCallback: () => {
      chacha.decrypt(ciphertextOneKiloByte);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertextOneKiloByte,
        null,
        nonce,
        key
      );
    },
    iterations: 2000,
  });

  benchmark({
    operation: "xchacha20poly1305 decrypt",
    sourceName: "100 KB",
    nobleCallback: () => {
      chacha.decrypt(ciphertextOneHundredKiloBytes);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertextOneHundredKiloBytes,
        null,
        nonce,
        key
      );
    },
    iterations: 200,
  });

  benchmark({
    operation: "xchacha20poly1305 decrypt",
    sourceName: "1 MB",
    nobleCallback: () => {
      chacha.decrypt(ciphertextOneMegaByte);
    },
    libsodiumCallback: () => {
      sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertextOneMegaByte,
        null,
        nonce,
        key
      );
    },
    iterations: 20,
  });
};
