/**
 * Implementation Verification Script
 * Verifies that all required files exist and are properly configured
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  // Core Implementation
  'src/models/Hotel.js',
  'src/repositories/hotelRepository.js',
  'src/services/hotelService.js',
  'src/controllers/hotelController.js',

  // Middleware
  'src/middleware/validation.js',
  'src/middleware/errorHandler.js',
  'src/middleware/rateLimiter.js',
  'src/middleware/security.js',

  // Routes
  'src/routes/hotels.js',
  'src/routes/index.js',

  // Application
  'src/app.js',
  'src/server.js',

  // Configuration
  'src/config/database.js',
  'src/utils/logger.js',
  'src/utils/constants.js',
  'src/utils/validators.js',

  // Database
  'knexfile.js',
  'migrations/20261109000001_create_hotels_table.js',
  'migrations/20261109000002_create_amenities_tables.js',
  'seeds/01_amenities.js',
  'seeds/02_hotels.js',

  // Tests
  'tests/unit/models/Hotel.test.js',
  'tests/unit/repositories/hotelRepository.test.js',
  'tests/unit/services/hotelService.test.js',
  'tests/unit/middleware/validation.test.js',
  'tests/integration/hotelApi.test.js',
  'tests/integration/criticalFixes.test.js',
  'tests/setup.js',

  // Configuration
  'package.json',
  'jest.config.js',
  '.env.example',

  // Documentation
  'HB001_IMPLEMENTATION.md',
  'SETUP_GUIDE.md',
  'IMPLEMENTATION_SUMMARY.md'
];

const requiredDependencies = [
  'express',
  'knex',
  'pg',
  'joi',
  'helmet',
  'cors',
  'express-rate-limit',
  'winston',
  'dotenv',
  'validator'
];

const requiredDevDependencies = [
  'jest',
  'supertest',
  'nodemon',
  'eslint'
];

function checkFiles() {
  console.log('🔍 Verifying Implementation Files...\n');

  let allFilesExist = true;
  const missingFiles = [];

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);

    if (exists) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      allFilesExist = false;
      missingFiles.push(file);
    }
  });

  return { allFilesExist, missingFiles };
}

function checkDependencies() {
  console.log('\n📦 Verifying Dependencies...\n');

  const packageJsonPath = path.join(__dirname, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  let allDepsPresent = true;

  console.log('Production Dependencies:');
  requiredDependencies.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} (${dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allDepsPresent = false;
    }
  });

  console.log('\nDevelopment Dependencies:');
  requiredDevDependencies.forEach(dep => {
    if (devDependencies[dep]) {
      console.log(`✅ ${dep} (${devDependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allDepsPresent = false;
    }
  });

  return allDepsPresent;
}

function checkScripts() {
  console.log('\n⚙️  Verifying NPM Scripts...\n');

  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};

  const requiredScripts = [
    'start',
    'dev',
    'test',
    'migrate:latest',
    'migrate:rollback',
    'seed:run'
  ];

  let allScriptsPresent = true;

  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ ${script}: ${scripts[script]}`);
    } else {
      console.log(`❌ ${script} - MISSING`);
      allScriptsPresent = false;
    }
  });

  return allScriptsPresent;
}

function checkEnvironment() {
  console.log('\n🔐 Verifying Environment Configuration...\n');

  const envExamplePath = path.join(__dirname, '.env.example');

  if (!fs.existsSync(envExamplePath)) {
    console.log('❌ .env.example not found');
    return false;
  }

  console.log('✅ .env.example exists');

  const envPath = path.join(__dirname, '.env');

  if (fs.existsSync(envPath)) {
    console.log('✅ .env exists');
  } else {
    console.log('⚠️  .env not found - Copy .env.example to .env and configure');
  }

  return true;
}

function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPLEMENTATION VERIFICATION REPORT');
  console.log('='.repeat(60) + '\n');

  const fileCheck = checkFiles();
  const depsCheck = checkDependencies();
  const scriptsCheck = checkScripts();
  const envCheck = checkEnvironment();

  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY');
  console.log('='.repeat(60) + '\n');

  console.log(`Files: ${fileCheck.allFilesExist ? '✅ All Present' : '❌ Missing Files'}`);
  console.log(`Dependencies: ${depsCheck ? '✅ All Present' : '❌ Missing Dependencies'}`);
  console.log(`Scripts: ${scriptsCheck ? '✅ All Present' : '❌ Missing Scripts'}`);
  console.log(`Environment: ${envCheck ? '✅ Configured' : '❌ Not Configured'}`);

  const allChecksPass = fileCheck.allFilesExist && depsCheck && scriptsCheck && envCheck;

  console.log('\n' + '='.repeat(60));
  if (allChecksPass) {
    console.log('✅ VERIFICATION PASSED - Implementation is complete!');
    console.log('='.repeat(60) + '\n');
    console.log('Next Steps:');
    console.log('1. Copy .env.example to .env and configure database');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run migrate:latest');
    console.log('4. Run: npm run seed:run');
    console.log('5. Run: npm test');
    console.log('6. Run: npm start');
  } else {
    console.log('❌ VERIFICATION FAILED - See issues above');
    console.log('='.repeat(60) + '\n');

    if (fileCheck.missingFiles.length > 0) {
      console.log('Missing Files:');
      fileCheck.missingFiles.forEach(file => console.log(`  - ${file}`));
    }
  }
  console.log();

  return allChecksPass ? 0 : 1;
}

// Run verification
if (require.main === module) {
  const exitCode = generateReport();
  process.exit(exitCode);
}

module.exports = { checkFiles, checkDependencies, checkScripts, checkEnvironment };
