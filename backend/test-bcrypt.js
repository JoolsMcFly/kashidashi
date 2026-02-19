const bcrypt = require('bcrypt');

// Your old Symfony password hash
const oldHash = '$2y$13$RI4Fbhm4d5k7A3e1EoHHw.7LLS.l4zM.mNEbN.8tcJFwiFawgUzl.';
const testPassword = 'coucou12';

async function test() {
  console.log('=== Bcrypt Compatibility Test ===\n');

  console.log('Old Symfony hash:', oldHash);
  console.log('Hash length:', oldHash.length);
  console.log('Test password:', testPassword);
  console.log('\n--- Test 1: Direct comparison with $2y$ ---');
  const isValid2y = await bcrypt.compare(testPassword, oldHash);
  console.log(`Result: ${isValid2y ? '✓ MATCH' : '✗ NO MATCH'}`);

  console.log('\n--- Test 2: Convert $2y$ to $2b$ and compare ---');
  const converted2b = oldHash.replace(/^\$2y\$/, '$2b$');
  console.log('Converted hash:', converted2b);
  const isValid2b = await bcrypt.compare(testPassword, converted2b);
  console.log(`Result: ${isValid2b ? '✓ MATCH' : '✗ NO MATCH'}`);

  console.log('\n--- Test 3: Create new hash with same password ---');
  const newHash = await bcrypt.hash(testPassword, 13);
  console.log('New Node.js hash:', newHash);
  const isValidNew = await bcrypt.compare(testPassword, newHash);
  console.log(`New hash works: ${isValidNew ? '✓ YES' : '✗ NO'}`);

  console.log('\n--- Test 4: Check if old hash is from different password ---');
  console.log('The old hash might be for a different password.');
  console.log('Please verify the password is exactly "coucou12" in Symfony.');
}

test();
