const { getBooksValidationSchema } = require('../../schema/items/getBooksValidationSchema');
const { storeTheBook, getBookById, getAllBooks, deleteBookById, updateBookById, getBooksByAuthorAndYear } = require('../../handlers/service');

const itemRoutes = (fastify, options, done) => {
  fastify.get('/book/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const bookToReturn = await getBookById(id);
    console.log("bookToReturn", bookToReturn);
    reply.send(bookToReturn);
  });

  fastify.post('/book', { preHandler: [fastify.authenticate, fastify.authorize(['admin'])], schema: getBooksValidationSchema }, async (request, reply) => {
    const book = request.body;
    const bookToReturn = await storeTheBook(book.author, book.title, book.publicationYear);
    reply.send(bookToReturn);
  });

  fastify.put('/book/:id', { preHandler: [fastify.authenticate, fastify.authorize(['admin'])], schema: getBooksValidationSchema }, async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;
    const bookEdited = await updateBookById(id, updates);
    if (bookEdited) {
      reply.send(bookEdited);
    } else {
      reply.status(404).send(`Book with id ${id} not found`);
    }
  });

  fastify.delete('/book/:id', { preHandler: [fastify.authenticate, fastify.authorize(['admin'])] }, async (request, reply) => {
    const { id } = request.params;
    const bookDeleted = await deleteBookById(id);
    if (bookDeleted) {
      reply.send(`Book with id ${id} is deleted`);
    } else {
      reply.status(404).send(`Book with id ${id} not found`);
    }
  });

  fastify.get('/books', { preHandler: [fastify.authenticate, fastify.authorize(['admin', 'normal'])] }, async (request, reply) => {
    console.log("User:", request.user);
    const books = await getAllBooks(request.query);
    reply.send(books);
  });

  done();
};

module.exports = { itemRoutes };
