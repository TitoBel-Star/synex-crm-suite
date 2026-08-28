#!/usr/bin/env bash
# build.sh - Script de construccion para Render.com
# Instala Python, pip, las dependencias cientificas, y luego construye el backend Node.js

set -e

echo "============================================================="
echo "Paso 1: Instalando dependencias Python para Mineria de Procesos"
echo "============================================================="

pip install --upgrade pip
pip install pandas pm4py

echo "============================================================="
echo "Paso 2: Instalando dependencias Node.js y compilando TypeScript"
echo "============================================================="

cd backend
npm install --production=false
npm run build

echo "============================================================="
echo "Construccion completada exitosamente"
echo "============================================================="
