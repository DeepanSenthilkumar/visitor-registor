const bcrypt = require('bcrypt');

(async () => {
  const plainPassword = 'IcodexAdmin@12345';
  const hashFromDb = '$2b$10$KTX3Zao5DDOuk3uoSJ68qe7mtjVoQjlL6A.jIuOHrz6SNfI0lwc.e';

  const result = await bcrypt.compare(plainPassword, hashFromDb);
  console.log('MATCH RESULT:', result);
})();

(async () => {
  const hash = '$2b$10$KTX3Zao5DDOuk3uoSJ68qe7mtjVoQjlL6A.jIuOHrz6SNfI0lwc.e';
  const result = await bcrypt.compare('IcodexAdmin@12345', hash);
  console.log(result);
})();
