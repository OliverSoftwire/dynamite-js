const { Compilation, sources } = require("webpack");
const path = require("path");

module.exports = {
	mode: "production",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "RNDBot.js",
		library: "RNDBot",
		libraryExport: "default"
	},
	optimization: {
		minimize: false
	},
	plugins: [
		{
			apply(compiler) {
				compiler.hooks.thisCompilation.tap("Replace", (compilation) => {
					compilation.hooks.processAssets.tap({ name: "AddRawExport", stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
						(assets) => {
							//give specific file name
							const fileContent = compilation.getAsset("RNDBot.js");
							const newFileContent = fileContent.source.source() + "\n\nmodule.exports = RNDBot;\n";
							compilation.updateAsset("RNDBot.js", new sources.RawSource(newFileContent));
						}
					);
				});
			}
		}
	]
}
