import { benchmarkSigning } from "./benchmarkSigning.js";
import { benchmarkXChacha20 } from "./benchmarkXChacha20.js";

benchmarkSigning();
benchmarkXChacha20();

document.querySelector("#loading")!.remove();
