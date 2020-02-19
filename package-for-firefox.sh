#!/bin/bash
mkdir -p build
mkdir -p tmp
cp volatility.png tmp
cp firefox-extension/* tmp
cd tmp
zip -r -FS ../build/firefox-extension.zip *
cd -
rm -rf tmp
