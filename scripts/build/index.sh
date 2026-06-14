#!/bin/bash

# Build package: ESM, CommonJS, generate types and prepare package.json.
#
# Usage:
# bash scripts/build/index.sh

set -e

BUILD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$BUILD_DIR/../utils/log.sh"

cd "$(dirname "$0")/../.." || exit 1

log -ic "⏳" -m "Cleaning up previous build..." -in
rm -rf dist
log -cl -s -m "Previous build cleaned up"

log -ic "⏳" -m "Building ESM modules..." -in
if ! OUTPUT=$(yarn swc src -d dist/esm --strip-leading-paths --ignore "node_modules,**/*.test.ts,**/*.d.ts" 2>&1); then
  log -cl -e -m "Error: ESM build failed!\n\n$OUTPUT\n"
  exit 1
fi
echo '{"type":"module"}' > dist/esm/package.json
log -cl -s -m "ESM modules built"

log -ic "⏳" -m "Building CommonJS modules..." -in
if ! OUTPUT=$(yarn swc src -d dist/cjs --config module.type=commonjs --strip-leading-paths --ignore "node_modules,**/*.test.ts,**/*.d.ts" 2>&1); then
  log -cl -e -m "Error: CommonJS build failed!\n\n$OUTPUT\n"
  exit 1
fi
echo '{"type":"commonjs"}' > dist/cjs/package.json
log -cl -s -m "CommonJS modules built"

log -ic "⏳" -m "Generating TypeScript declarations..." -in
if ! OUTPUT=$(yarn tsc --emitDeclarationOnly --outDir dist/types --declarationDir dist/types 2>&1); then
  log -cl -e -m "Error: TypeScript declarations generation failed!\n\n$OUTPUT\n"
  exit 1
fi
log -cl -s -m "TypeScript declarations generated"

log -ic "⏳" -m "Preparing minified package.json..." -in
if ! OUTPUT=$(node "$BUILD_DIR/_internal/copy-package-json.js" 2>&1); then
  log -cl -e -m "Error: Failed to prepare package.json!\n\n$OUTPUT\n"
  exit 1
fi
log -cl -s -m "package.json prepared"

echo ""
log -ic "✨" -s -m "Build completed successfully!"
