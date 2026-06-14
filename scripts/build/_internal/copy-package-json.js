import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../..');
const packageJsonPath = path.join(rootDir, 'package.json');
const distPackageJsonPath = path.join(rootDir, 'dist', 'package.json');

try {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const minifiedPkg = {
    name: pkg.name,
    version: pkg.version,
    type: pkg.type,
  };

  fs.writeFileSync(distPackageJsonPath, JSON.stringify(minifiedPkg, null, 2));
} catch (error) {
  console.error(`   ${error.message}`);
  process.exit(1);
}
