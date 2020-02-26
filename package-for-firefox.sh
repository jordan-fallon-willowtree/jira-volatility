#!/bin/bash
mkdir -p build
npm run bundle

mkdir -p tmp
cp volatility.png build/firefox-extension
cp firefox-extension/manifest.json build/firefox-extension

cd build/firefox-extension
zip -r -FS ../firefox-extension.zip *
