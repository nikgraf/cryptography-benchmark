import { benchmarkSigning } from "./benchmarkSigning.js";
import { benchmarkXChacha20 } from "./benchmarkXChacha20.js";

const run = async () => {
  await benchmarkSigning();
  await benchmarkXChacha20();
};

const runBenchmarkButton = document.getElementById("run-benchmark");
runBenchmarkButton?.addEventListener("click", async () => {
  runBenchmarkButton.setAttribute("disabled", "disabled");

  setTimeout(async () => {
    await run();
    runBenchmarkButton.removeAttribute("disabled");
  }, 100);
});
