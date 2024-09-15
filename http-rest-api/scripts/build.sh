#!/bin/sh

set -e

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

clear() {
  echo "Limpando a pasta dist..."
  rm -rf ./dist/*
}

tsc() {
  echo "Compilando Typescript..."
  ./node_modules/.bin/tsc --project tsconfig.build.json --skipLibCheck
}

copy() {
  echo "Copiando package.json para dist..."
  cp ./package.json ./dist/package.json
  cp ./package-lock.json ./dist/package-lock.json
}

install() {
  echo "Instalando dependências na pasta dist..."
  cd ./dist
  npm ci --omit=dev
  cd ..
}

compile() {
  clear
  tsc
  copy
  install
}

start() {
  cd "$SCRIPT_DIR" && cd ..
  compile
  cd "$RUN_DIR"
}

start
