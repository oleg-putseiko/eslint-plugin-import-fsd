import fs from 'fs';

try {
  const yamlPath = process.env.DEPENDABOT_FILE_PATH;

  if (!yamlPath) throw new Error('DEPENDABOT_FILE_PATH is not defined');

  const yamlContent = fs.readFileSync(yamlPath, 'utf8');

  const packages = [...new Set(process.env.PACKAGES_ENV.split(/\s+/).filter(Boolean))];

  const ignoreLines = [
    '    ignore:',
    "      - dependency-name: '*'",
    "        update-types: ['version-update:semver-major']",
  ];

  packages.forEach((pkg) => {
    ignoreLines.push(
      `      - dependency-name: '${pkg}'`,
      `        update-types: ['version-update:semver-minor']`,
    );
  });

  const ignoreText = ignoreLines.join('\n');

  const npmSectionMatch = yamlContent.match(/package-ecosystem:\s*["']npm["']/);
  if (!npmSectionMatch) {
    console.error('npm ecosystem block not found in Dependabot config.');
    process.exit(1);
  }
  const npmSectionStart = npmSectionMatch.index;

  const groupsStart = yamlContent.indexOf('    groups:', npmSectionStart);
  if (groupsStart === -1) {
    console.error('Groups block not found inside npm section. Auto-insertion aborted.');
    process.exit(1);
  }

  const oldIgnoreStart = yamlContent.indexOf('    ignore:', npmSectionStart);

  let newContent;
  if (oldIgnoreStart !== -1 && oldIgnoreStart < groupsStart) {
    const before = yamlContent.slice(0, oldIgnoreStart);
    const after = yamlContent.slice(groupsStart);
    newContent = `${before}${ignoreText}\n${after}`;
  } else {
    const before = yamlContent.slice(0, groupsStart);
    const after = yamlContent.slice(groupsStart);
    newContent = `${before}${ignoreText}\n${after}`;
  }

  if (yamlContent !== newContent) {
    fs.writeFileSync(yamlPath, newContent);
    console.log('__UPDATED__');
  } else {
    console.log('__SKIPPED__');
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
