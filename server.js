const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${port}...`);
});
