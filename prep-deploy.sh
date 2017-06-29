#!/usr/bin/env sh

set -e

if ! which yarn; then
  echo "Missing yarn"
  exit 1
fi
if ! which firebase; then
  echo "Missing firebase-tools"
  exit 1
fi

TMP=$(mktemp -dt fight-timer)
yarn build
mv build/* $TMP
cat >> build/index.html<<EOF
<!doctype html>
<html lang="en">
  <head>
    <title>Fight Tools</title>
  </head>
  <body>
    <h1>Hello! You're most likely looking for the <a href="/timer">Fight Timer</a></h1>
  </body>
</html>
EOF
mv $TMP build/timer

echo "Done! You may now run firebase deploy in order to deploy changes"
