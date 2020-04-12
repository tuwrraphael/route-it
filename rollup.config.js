import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";

export default {
    input: "src/index.ts",
    output: [

        {
            file: pkg.module,
            sourcemap: true,
            format: "esm"
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        typescript({
            typescript: require("typescript"),
        }),
        sourceMaps(),
        terser(),
        del({ targets: "dist/*" })
    ]
};