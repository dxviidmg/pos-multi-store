#!/usr/bin/env node
/**
 * Fase 0 del reorg: convertir imports relativos (./ y ../) a alias @/src/...
 * No mueve archivos. Resuelve cada ruta relativa a una ruta absoluta desde la
 * raíz del repo y la reescribe como alias, verificando que el destino exista.
 *
 * Uso:
 *   node scripts/relative-to-alias.js           # dry-run (no escribe)
 *   node scripts/relative-to-alias.js --write    # aplica cambios
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const WRITE = process.argv.includes('--write');

const EXTS = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

// Encuentra recursivamente los archivos de código.
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (CODE_EXTS.includes(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

// Dado un import resuelto (sin extensión), confirma que exista un archivo o
// index correspondiente, y devuelve true si es resoluble.
function resolves(absNoExt) {
  for (const ext of EXTS) {
    if (fs.existsSync(absNoExt + ext)) return true;
  }
  // ¿Es un directorio con index?
  if (fs.existsSync(absNoExt) && fs.statSync(absNoExt).isDirectory()) {
    for (const ext of CODE_EXTS) {
      if (fs.existsSync(path.join(absNoExt, 'index' + ext))) return true;
    }
  }
  // ¿Import directo de un archivo con extensión (imágenes, css, json)?
  if (fs.existsSync(absNoExt)) return true;
  return false;
}

// Regex para capturar el specifier en import/export ... from '...' y require('...')
const IMPORT_RE = /(\bfrom\s+|\brequire\(\s*|\bimport\(\s*)(['"])(\.\.?\/[^'"]*)\2/g;

let totalFiles = 0;
let changedFiles = 0;
let totalReplacements = 0;
const unresolved = [];

for (const file of walk(SRC)) {
  const original = fs.readFileSync(file, 'utf8');
  const fileDir = path.dirname(file);
  let replacements = 0;

  const updated = original.replace(IMPORT_RE, (match, prefix, quote, spec) => {
    // Resolver la ruta relativa respecto al directorio del archivo actual.
    const absTarget = path.resolve(fileDir, spec);
    // Ruta relativa desde la raíz del repo (para el alias @/*).
    const fromRoot = path.relative(ROOT, absTarget).split(path.sep).join('/');

    // Solo convertimos rutas que caen dentro de src/ (dentro del repo).
    if (!fromRoot.startsWith('src/')) {
      unresolved.push({ file: path.relative(ROOT, file), spec, reason: 'fuera de src/' });
      return match;
    }

    if (!resolves(absTarget)) {
      unresolved.push({ file: path.relative(ROOT, file), spec, reason: 'no resuelve' });
      return match;
    }

    replacements++;
    return `${prefix}${quote}@/${fromRoot}${quote}`;
  });

  totalFiles++;
  if (replacements > 0) {
    changedFiles++;
    totalReplacements += replacements;
    if (WRITE) fs.writeFileSync(file, updated);
  }
}

console.log(`Modo: ${WRITE ? 'WRITE' : 'DRY-RUN'}`);
console.log(`Archivos escaneados: ${totalFiles}`);
console.log(`Archivos con cambios: ${changedFiles}`);
console.log(`Imports convertidos: ${totalReplacements}`);
if (unresolved.length) {
  console.log(`\nImports NO convertidos (${unresolved.length}):`);
  for (const u of unresolved) console.log(`  [${u.reason}] ${u.file}  ->  ${u.spec}`);
}
