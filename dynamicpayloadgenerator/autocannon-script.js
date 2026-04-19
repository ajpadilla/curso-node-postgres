const fs = require('fs');

const TOTAL = 5000; // number of requests you want

const users = [];

for (let i = 0; i < TOTAL; i++) {
  users.push({
    email: `test_${Date.now()}_${i}@test.com`,
    password: '12345678',
    role: 'customer'
  });
}

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
console.log('✅ users.json generated');
