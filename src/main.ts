import "./styles.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>
      Benchmark
    </h1>
    <table>
      <tr>
        <th>Operation</th>
        <th>Source</th>
        <th>Noble ops/sec</th>
        <th>Libsodium ops/sec</th>
      </tr>
    </table>
  </div>
`;

import { ed25519 } from "@noble/curves/ed25519";
import sodium from "libsodium-wrappers";
import {
  oneHundredKiloBytes,
  oneKiloByte,
  oneMegaByte,
  tenBytes,
} from "./data";

type MeasureParams = {
  operation: string;
  sourceName: string;
  nobleCallback: (iteration: number) => void;
  libsodiumCallback: (iteration: number) => void;
  iterations?: number;
};

const benchmark = ({
  operation,
  sourceName,
  nobleCallback,
  libsodiumCallback,
  iterations,
}: MeasureParams) => {
  const table = document.querySelector("table")!;
  const row = table.insertRow();
  row.insertCell().textContent = operation;
  row.insertCell().textContent = sourceName;

  const iterationsWithDefault: number = iterations || 2000;
  const startNoble = performance.now();
  for (let iteration = 0; iteration < iterationsWithDefault; iteration++) {
    nobleCallback(iteration);
  }
  const endNoble = performance.now();
  const opsPerSecondNoble =
    (iterationsWithDefault / (endNoble - startNoble)) * 1000;
  const nobleRow = row.insertCell();
  nobleRow.textContent = Math.round(opsPerSecondNoble).toString();

  const startLibsodium = performance.now();
  for (let iteration = 0; iteration < iterationsWithDefault; iteration++) {
    libsodiumCallback(iteration);
  }
  const endLibsodium = performance.now();
  const opsPerSecondLibsodium =
    (iterationsWithDefault / (endLibsodium - startLibsodium)) * 1000;
  const libsodiumRow = row.insertCell();
  libsodiumRow.textContent = Math.round(opsPerSecondLibsodium).toString();

  if (opsPerSecondNoble > opsPerSecondLibsodium) {
    nobleRow.style.background = "lightgreen";
  } else {
    libsodiumRow.style.background = "lightgreen";
  }
};

await sodium.ready;

// benchmark({
//   name: "Noble ed25519",
//   work: () => {
//     const priv = ed25519.utils.randomPrivateKey();
//     const pub = ed25519.getPublicKey(priv);
//     const sig = ed25519.sign(msg, priv);
//     const result = ed25519.verify(sig, msg, pub);
//   },
// });

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
    const sig = sodium.crypto_sign_detached(tenBytes, sodiumKeyPair.privateKey);
  },
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
  iterations: 1000,
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
  iterations: 100,
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
  iterations: 10,
});

const pub = ed25519.getPublicKey(noblePriv);
const sigTenBytes = ed25519.sign(tenBytes, noblePriv);
const sigOneKiloByte = ed25519.sign(oneKiloByte, noblePriv);
const sigOneHundredKiloBytes = ed25519.sign(oneHundredKiloBytes, noblePriv);
const sigOneMegaByte = ed25519.sign(oneMegaByte, noblePriv);

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
  iterations: 1000,
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
  iterations: 100,
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
  iterations: 10,
});
