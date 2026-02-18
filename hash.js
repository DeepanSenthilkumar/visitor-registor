const bcrypt = require('bcrypt');

(async () => {
  const password = 'IcodexAdmin@12345';
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
})();
