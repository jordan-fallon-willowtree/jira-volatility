#!/bin/bash
mkdir build
mkdir tmp
cp volatility.png tmp
cp firefox-extension/manifest.json tmp
cp firefox-extension/script.js tmp
zip -r -FS build/firefox-extension.zip tmp
rm -rf tmp
