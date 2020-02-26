#!/bin/bash
mkdir -p build
npm run bundle

mkdir -p tmp
cp volatility.png tmp
cp firefox-extension/manifest.json tmp
cp build/firefox-extension/bundle.js tmp

cd tmp
zip -r -FS ../build/firefox-extension.zip *

cd -
rm -rf tmp
