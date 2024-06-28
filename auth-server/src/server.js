const { build } = require("./app")
const { Pool } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const app = build({ logger: true },
  {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  })

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});



async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('Database connection successful');

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database', err);
  } finally {
    client.release();
  }
}

initializeDatabase();


app.listen({
  port: 3001,
  host: "127.0.0.1"
})

