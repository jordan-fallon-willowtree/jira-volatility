#!/bin/bash
mkdir -p build
mkdir -p tmp
cp volatility.png tmp
cp firefox-extension/manifest.json tmp
cp firefox-extension/script.js tmp
cd tmp
zip -r -FS ../build/firefox-extension.zip *
cd -
rm -rf tmp
