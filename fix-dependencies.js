// Fix for React and Radix UI compatibility issues
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Downgrade React to a version compatible with current Radix UI
packageJson.dependencies.react = "^18.2.0";
packageJson.dependencies["react-dom"] = "^18.2.0";

// Ensure all Radix UI packages are at compatible versions
const radixPackages = Object.keys(packageJson.dependencies).filter(pkg => pkg.startsWith('@radix-ui/'));
console.log('Updating the following Radix UI packages:', radixPackages);

// Write the updated package.json
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + '\n',
  'utf8'
);

console.log('Updated package.json with compatible React and Radix UI versions');
console.log('Please run "npm install" to apply these changes'); 