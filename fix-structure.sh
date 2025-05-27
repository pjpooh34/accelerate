#!/bin/bash

# Remove unwanted folders if they exist
rm -rf dist Downloads

# Create required config files if missing
touch .gitignore .nvmrc postcss.config.js tailwind.config.js vite.config.js

# Ensure public/ and vite.svg
mkdir -p public
touch public/vite.svg

# Ensure src/ and required files
mkdir -p src
touch src/App.jsx src/App.css src/main.jsx src/index.css

# Done!
echo "Structure fixed. Please manually copy any needed code into the new files."