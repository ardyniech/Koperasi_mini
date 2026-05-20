#!/bin/bash
export ESBUILD_BINARY_PATH=/data/data/com.termux/files/home/koperasi_mini/frontend/node_modules/esbuild/bin/esbuild
cd /data/data/com.termux/files/home/koperasi_mini/frontend
npx vite --host 0.0.0.0 --port 5173
