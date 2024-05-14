export type BenchmarkParams = {
  operation: string;
  sourceName: string;
  nobleCallback: (iteration: number) => void;
  libsodiumCallback: (iteration: number) => void;
  iterations?: number;
};

export const benchmark = ({
  operation,
  sourceName,
  nobleCallback,
  libsodiumCallback,
  iterations,
}: BenchmarkParams) => {
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
