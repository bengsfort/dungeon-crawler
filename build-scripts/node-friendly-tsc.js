// This was going to be used for the dev server when we `cluster.fork` but
// I don't know if we need this anymore.

const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const process = require("process");

const [_nodePath, _file, ...args] = process.argv;

function getArgValue(name, defaultVal) {
  const index = args.indexOf(name);
  if (index < 0) return defaultVal;
  return args[index + 1];
}

function reportDiagnostics(diagnostics) {
  diagnostics.forEach((diagnostic) => {
    let message = "Error";
    if (diagnostic.file) {
      const where = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      message += ` ${diagnostic.file.fileName} ${where.line}, ${
        where.character + 1
      }`;
    }
    message +=
      ": " + ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    console.log(message);
  });
}

function readConfigFile(configFileName) {
  // Read config file
  const configFileText = fs.readFileSync(configFileName).toString();

  // Parse JSON, after removing comments. Just fancier JSON.parse
  const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
  const configObject = result.config;
  if (!configObject) {
    reportDiagnostics([result.error]);
    process.exit(1);
  }

  // Extract config infromation
  const configParseResult = ts.parseJsonConfigFileContent(
    configObject,
    ts.sys,
    path.dirname(configFileName)
  );
  if (configParseResult.errors.length > 0) {
    reportDiagnostics(configParseResult.errors);
    process.exit(1);
  }
  return configParseResult;
}

function compile(configFileName) {
  console.log("Building with config file:", configFileName);

  // Extract configuration from config file
  const config = readConfigFile(configFileName);

  // Compile
  const program = ts.createProgram(config.fileNames, config.options);
  const emitResult = program.emit();

  // Report errors
  reportDiagnostics(
    ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  );

  // Return code
  const exitCode = emitResult.emitSkipped ? 1 : 0;
  process.exit(exitCode);
}

function watch(configFileName) {
  console.log("Watching with config file:", configFileName);
  // Extract configuration from config file
  const config = readConfigFile(configFileName);

  // Watch
  const host = ts.createWatchCompilerHost(
    config.fileNames,
    config.options,
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram
  );
  ts.createWatchProgram(host);
}

const buildType = getArgValue("--type", "compile");
const fileName = getArgValue("--config", "tsconfig.json");

if (buildType === "watch") {
  watch(fileName);
} else if (buildType === "compile") {
  compile(fileName);
}
