#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_PATH="$SCRIPT_DIR"
CONSUMER_PATH="$SCRIPT_DIR/../damo-auth"
RELEASES_DIR="$MONOREPO_PATH/releases"

PACKAGES=(
  "packages/firebaseui-core"
  "packages/firebaseui-angular"
  "packages/firebaseui-styles"
  "packages/firebaseui-translations"
)

echo "🔨 Building all packages in the monorepo..."
cd "$MONOREPO_PATH"
pnpm --filter "@firebase-ui/*" run build || {
  echo "Build failed"
  exit 1
}

echo ""
echo "Packing packages into tarballs..."


pnpm run release:all
echo ""
echo "Installing tarballs in consumer project: $CONSUMER_PATH"
echo "We are here $(pwd)"
cd "$CONSUMER_PATH" || {
  echo "Consumer project not found at: $CONSUMER_PATH"
  exit 1
}
TARBALLS=("$RELEASES_DIR"/*.tgz)
if [[ ! -f "${TARBALLS[0]}" ]]; then
  echo "No .tgz files found in $RELEASES_DIR"
  exit 1
fi

 for TARBALL in "${TARBALLS[@]}"; do
  echo "Installing $TARBALL"
  npm install "$TARBALL"
done


echo ""
echo "Done"
