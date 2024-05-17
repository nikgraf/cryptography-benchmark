import { ed25519 } from "@noble/curves/ed25519";
import sodium from "libsodium-wrappers";
import { benchmark } from "./benchmark.js";
import {
  getOneHundredKiloBytes,
  getOneKiloByte,
  getOneMegaByte,
  getTenBytes,
} from "./data";

export const benchmarkSigning = async () => {
  await sodium.ready;

  const tenBytes = getTenBytes();
  const oneKiloByte = getOneKiloByte();
  const oneHundredKiloBytes = getOneHundredKiloBytes();
  const oneMegaByte = getOneMegaByte();

  benchmark({
    operation: "ed25519 keypair generation",
    sourceName: "",
    nobleCallback: () => {
      const priv = ed25519.utils.randomPrivateKey();
      const pub = ed25519.getPublicKey(priv);
    },
    libsodiumCallback: () => {
      const keyPair = sodium.crypto_sign_keypair();
    },
    iterations: 5000,
  });

  const noblePriv = ed25519.utils.randomPrivateKey();
  const sodiumKeyPair = sodium.crypto_sign_keypair();

  benchmark({
    operation: "ed25519 sign",
    sourceName: "10 Bytes",
    nobleCallback: () => {
      const sig = ed25519.sign(tenBytes, noblePriv);
    },
    libsodiumCallback: () => {
      const sig = sodium.crypto_sign_detached(
        tenBytes,
        sodiumKeyPair.privateKey
      );
    },
    iterations: 5000,
  });

  benchmark({
    operation: "ed25519 sign",
    sourceName: "1 KB",
    nobleCallback: () => {
      const sig = ed25519.sign(oneKiloByte, noblePriv);
    },
    libsodiumCallback: () => {
      const sig = sodium.crypto_sign_detached(
        oneKiloByte,
        sodiumKeyPair.privateKey
      );
    },
    iterations: 2000,
  });

  benchmark({
    operation: "ed25519 sign",
    sourceName: "100 KB",
    nobleCallback: () => {
      const sig = ed25519.sign(oneHundredKiloBytes, noblePriv);
    },
    libsodiumCallback: () => {
      const sig = sodium.crypto_sign_detached(
        oneHundredKiloBytes,
        sodiumKeyPair.privateKey
      );
    },
    iterations: 200,
  });

  benchmark({
    operation: "ed25519 sign",
    sourceName: "1 MB",
    nobleCallback: () => {
      const sig = ed25519.sign(oneMegaByte, noblePriv);
    },
    libsodiumCallback: () => {
      const sig = sodium.crypto_sign_detached(
        oneMegaByte,
        sodiumKeyPair.privateKey
      );
    },
    iterations: 20,
  });

  const pub = ed25519.getPublicKey(noblePriv);
  const sigTenBytes = ed25519.sign(tenBytes, noblePriv);
  const sigOneKiloByte = ed25519.sign(oneKiloByte, noblePriv);
  const sigOneHundredKiloBytes = ed25519.sign(oneHundredKiloBytes, noblePriv);
  const sigOneMegaByte = ed25519.sign(oneMegaByte, noblePriv);

  console.log(
    "ed25519.verify(sigTenBytes, tenBytes, pub)",
    ed25519.verify(sigTenBytes, tenBytes, pub)
  );
  console.log(
    "sodium.crypto_sign_verify_detached(sigTenBytes, tenBytes, pub)",
    sodium.crypto_sign_verify_detached(sigTenBytes, tenBytes, pub)
  );

  benchmark({
    operation: "ed25519 verify",
    sourceName: "10 Bytes",
    nobleCallback: () => {
      const result = ed25519.verify(sigTenBytes, tenBytes, pub);
    },
    libsodiumCallback: () => {
      const result = sodium.crypto_sign_verify_detached(
        sigTenBytes,
        tenBytes,
        pub
      );
    },
    iterations: 5000,
  });

  benchmark({
    operation: "ed25519 verify",
    sourceName: "1 KB",
    nobleCallback: () => {
      const result = ed25519.verify(sigOneKiloByte, oneKiloByte, pub);
    },
    libsodiumCallback: () => {
      const result = sodium.crypto_sign_verify_detached(
        sigOneKiloByte,
        oneKiloByte,
        pub
      );
    },
    iterations: 2000,
  });

  benchmark({
    operation: "ed25519 verify",
    sourceName: "100 KB",
    nobleCallback: () => {
      const result = ed25519.verify(
        sigOneHundredKiloBytes,
        oneHundredKiloBytes,
        pub
      );
    },
    libsodiumCallback: () => {
      const result = sodium.crypto_sign_verify_detached(
        sigOneHundredKiloBytes,
        oneHundredKiloBytes,
        pub
      );
    },
    iterations: 200,
  });

  benchmark({
    operation: "ed25519 verify",
    sourceName: "1 MB",
    nobleCallback: () => {
      const result = ed25519.verify(sigOneMegaByte, oneMegaByte, pub);
    },
    libsodiumCallback: () => {
      const result = sodium.crypto_sign_verify_detached(
        sigOneMegaByte,
        oneMegaByte,
        pub
      );
    },
    iterations: 20,
  });
};
