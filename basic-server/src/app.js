const fastify = require('fastify');
const { itemRoutes } = require('./routes/v1/items');
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

 app.decorate("authenticate", async function (request, reply) {
    try {
      console.log(request.user,"request in authentication");
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
  
 app.decorate("authorize", (roles) => {
    return async (request, reply) => {
      
      const { role } = request.user;
      console.log({request ,role});
      if (!roles.includes(role)) {
        return reply.status(403).send({ error: 'Forbidden' });
      }
    }
  });
  app.register(swagger);
  app.register(swaggerUi, swaggerOpts);
  app.register(itemRoutes);

  return app;
};

module.exports = {
  build
};
