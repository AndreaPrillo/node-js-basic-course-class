const { Pool } = require('pg');
const { signupSchema } = require('../../schema/items/signupSchema');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const bcrypt = require('bcrypt');

const authRoutes = (fastify, options, done) => {

  fastify.post('/signup',{ schema: { body: signupSchema } }, async (request, reply) => {
    const { username, password, role } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const client = await pool.connect();
      const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
      const values = [username, hashedPassword, role];
      const res = await client.query(query, values);
      client.release();

      reply.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error registering user', err);
      reply.status(500).send({ error: 'Error registering user' });
    }
  });

  fastify.post('/signin', async (request, reply) => {
    const { username, password } = request.body;

    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users WHERE username = $1';
      const res = await client.query(query, [username]);
      client.release();


      if (res.rows.length === 0) {
        return reply.status(401).send({ error: 'Invalid username or password' });
      }

      const user = res.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);


      if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Invalid username or password' });
      }

      const token = fastify.jwt.sign({ username: user.username, role: user.role }, {expiresIn: "1h"});
      reply.setCookie('token', token, { httpOnly: true }).send({ message: 'Logged in successfully', token });
    } catch (err) {
      console.error('Error signing in', err);
      reply.status(500).send({ error: 'Error signing in' });
    }
  });

  fastify.post('/logout', async (request, reply) => {
    try {
      reply.clearCookie('token').send({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Error during logout', err);
      reply.status(500).send({ error: 'Error during logout' });
    }
  });

  done()
}


module.exports = { authRoutes }
