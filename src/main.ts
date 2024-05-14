import { benchmarkXChacha20 } from "./benchmarkXChacha20.js";
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

await new Promise((resolve) => setTimeout(resolve, 50));

// benchmarkSigning();
benchmarkXChacha20();

document.querySelector("#loading")!.remove();
