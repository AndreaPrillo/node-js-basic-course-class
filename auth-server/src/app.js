const fastify = require('fastify');
const { authRoutes } = require('./routes/auth/authRoutes');
const swaggerUi = require('@fastify/swagger-ui');
const swagger = require('@fastify/swagger');
const fastifyJwt = require('@fastify/jwt');
const fastifyCookie = require('@fastify/cookie');

const build = (options = {}, swaggerOpts = {}) => {
  const app = fastify(options);

  app.register(fastifyJwt, {
    secret: process.env.SECRETKEY, cookie: {
      cookieName: 'token', signed: false,
    }
  });

  app.register(fastifyCookie);
  app.register(authRoutes);
  app.register(swagger);
  app.register(swaggerUi, swaggerOpts);

  return app;
};

module.exports = {
  build
};
