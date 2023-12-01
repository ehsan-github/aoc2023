import fs from "fs";
import * as R from "ramda";
/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.js,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 */
export function readFile(filePath: string) {
  try {
    const data = fs.readFileSync(filePath);
    return data.toString();
  } catch (error: any) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

/** parse text into array */
export const p = R.pipe(R.split("\n"), R.map(R.trim));
/** parse text into array of numbers */
export const pn = R.pipe(p, R.map(Number));
/** parse text into array of numbers */
export const trace = (label: string) => (x: unknown) => {
  console.log(label, x);
  return x;
};
