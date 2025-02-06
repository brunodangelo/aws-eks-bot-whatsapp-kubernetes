import pkg from 'pg';

const config = {
  connectionString: process.env.PSQL_URI || ''
};

const pool = new pkg.Pool(config);

pool.connect(function (err) {
  if (err)
      throw err;
  console.log("DB connetion success!");
});

export default pool;