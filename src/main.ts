import { benchmarkSigning } from "./benchmarkSigning.js";
import "./styles.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>
      Benchmark
    </h1>
    <p id="loading">Running benchmarks (this takes a while)</p>
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

benchmarkSigning();

document.querySelector("#loading")!.remove();
