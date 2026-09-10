#!/usr/bin/env node
/**
 * Reescribe referencias de alias tras mover carpetas/archivos.
 * Reemplaza el prefijo de path en todos los imports @/src/... del repo.
 *
 * Uso:
 *   node scripts/rewrite-alias.js <viejo> <nuevo> [--write]
 * Ejemplo:
 *   node scripts/rewrite-alias.js src/theme src/shared/theme --write
 *
 * Nota: NO mueve archivos (eso se hace con git mv aparte). Solo actualiza
 * las cadenas de import que empiezan con "@/<viejo>" para que apunten a
 * "@/<nuevo>". Coincide con límites de segmento para no romper prefijos
 * parciales (p.ej. src/theme no afecta a src/themeX).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const [oldPath, newPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const WRITE = process.argv.includes('--write');

if (!oldPath || !newPath) {
  console.error('Uso: node scripts/rewrite-alias.js <viejo> <nuevo> [--write]');
  process.exit(1);
}

const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx'];
const SCAN_DIRS = ['src', 'app'];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (CODE_EXTS.includes(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

// Coincide "@/<old>" seguido de fin de segmento (/ o comilla).
const esc = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = new RegExp(`(['"])@/${esc}(?=['"/])`, 'g');

let changed = 0;
let total = 0;
for (const dir of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    const src = fs.readFileSync(file, 'utf8');
    if (!RE.test(src)) continue;
    RE.lastIndex = 0;
    const out = src.replace(RE, (m, q) => `${q}@/${newPath}`);
    const n = (src.match(RE) || []).length;
    RE.lastIndex = 0;
    total += n;
    changed++;
    if (WRITE) fs.writeFileSync(file, out);
  }
}

console.log(`${WRITE ? 'WRITE' : 'DRY-RUN'}: @/${oldPath} -> @/${newPath}`);
console.log(`Archivos afectados: ${changed}, referencias: ${total}`);
