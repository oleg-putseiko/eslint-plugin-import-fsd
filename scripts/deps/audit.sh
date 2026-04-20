#!/bin/bash

# Scans yarn.lock for unstable (0.x.x) dependencies.
#
# Can optionally run an npm audit and automatically configure Dependabot
# to ignore minor version updates for these specific packages. This protects
# the project from unexpected breaking changes typical in zero-major releases.
#
# Flags:
#   --npm          : Run 'yarn npm audit' before scanning.
#   --pin-unstable : Automatically write ignore rules to .github/dependabot.yml.
#   --silent       : Suppress standard output logs (useful for CI/CD).
#   --meta         : Emit state markers (__UPDATED__, __SKIPPED__) for automation workflows.
#
# Usage:
# bash scripts/yarn/check-unstable.sh [--npm] [--pin-unstable] [--silent]

DEPS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DEPS_DIR/../utils/log.sh"

cd "$(dirname "$0")/../.." || exit 1

LOCKFILE_PATH="yarn.lock"
DEPENDABOT_FILE_PATH=".github/dependabot.yml"

RUN_NPM_AUDIT=false
PIN_UNSTABLE=false
SILENT_MODE=false
EMIT_META=false

for arg in "$@"; do
  case $arg in
    --npm)
      RUN_NPM_AUDIT=true
      ;;
    --pin-unstable)
      PIN_UNSTABLE=true
      ;;
    --silent)
      SILENT_MODE=true
      ;;
    --meta)
      EMIT_META=true
      ;;
  esac
done

emit_meta() {
  if [ "$EMIT_META" = true ]; then
    echo "$1"
  fi
}

if [ "$RUN_NPM_AUDIT" = true ]; then
  log -ic "🛡️" -m "Running yarn npm audit...\n"

  if [ "$SILENT_MODE" = true ]; then
    yarn npm audit --recursive --all > /dev/null 2>&1
  else
    yarn npm audit --recursive --all
    log -m "\n"
  fi
fi

if [ ! -f "$LOCKFILE_PATH" ]; then
  log -cl -e -m "Error: File $LOCKFILE_PATH not found in the project root!\n"
  exit 1
fi

log -ic "⏳" -m "Searching $LOCKFILE_PATH for 0.x.x packages..." -in

PACKAGE_INFO=$(awk '/^[^[:space:]]/ {pkg=$0} /^[[:space:]]*version: "?0\./ {
  ver=$2; gsub(/["\r]/, "", ver); print pkg "===" ver
}' "$LOCKFILE_PATH" | sed -E 's/^"?(@?[^@:,]+)@.*===([^ ]+)/\1 \2/' | sort -u)

if [ -z "$PACKAGE_INFO" ]; then
  log -cl -s -m "No packages with 0.x.x version found."
  emit_meta "__SKIPPED__"
  exit 0
fi

TOTAL=$(echo "$PACKAGE_INFO" | wc -l | tr -d ' ')

log -cl -w -m "Found potentially unstable packages: $TOTAL"

if [ "$SILENT_MODE" = false ]; then
  echo ""
  echo "📦 Packages list:"
  echo "$PACKAGE_INFO" | while read -r pkg ver; do
    echo "  - $pkg: $ver"
  done
  echo ""
fi

if [ "$PIN_UNSTABLE" = true ]; then
  if [ ! -f "$DEPENDABOT_FILE_PATH" ]; then
    log -cl -e -m "Error: File $DEPENDABOT_FILE_PATH not found. Cannot add exceptions."
    exit 1
  fi

  log -c "⏳" -m "Updating $DEPENDABOT_FILE_PATH..." -in

  PACKAGES_ONLY=$(echo "$PACKAGE_INFO" | awk '{print $1}')
  export PACKAGES_ENV="$PACKAGES_ONLY"

  NODE_RESULT=$(DEPENDABOT_FILE_PATH="$DEPENDABOT_FILE_PATH" node ./scripts/deps/_internal/update-dependabot.js 2>&1)

  if [ $? -eq 0 ]; then
    if [[ "$NODE_RESULT" == *"__UPDATED__"* ]]; then
      log -cl -s -m "Package update exceptions written to dependabot.yml"
      emit_meta "__UPDATED__"
    elif [[ "$NODE_RESULT" == *"__SKIPPED__"* ]]; then
      log -cl -i -ic "⏩" -m "The dependabot.yml file has not been modified"
      emit_meta "__SKIPPED__"
    fi
  else
    log -cl -e -m "Error: $NODE_RESULT"
    exit 1
  fi
else
  if [ "$SILENT_MODE" = false ]; then
    log -i -ic "💡" -m "Run with --pin-unstable to automatically block minor updates for these packages."
  fi
fi
