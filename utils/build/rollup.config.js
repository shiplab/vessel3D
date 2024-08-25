import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
// import resolve from "@rollup/plugin-node-resolve";

const builds = [ {
	input: "source/vessel3D.js",
	output: {
		format: "esm",
		file: "build/vessel3D.js",
	},
	plugins: [
		commonjs()
	]
},
{
	input: "source/vessel3D.js",
	output: {
		format: "esm",
		file: "build/vessel3D.min.js",
	},
	plugins: [
		terser()
	]
}
];

export default ( args ) => builds;
