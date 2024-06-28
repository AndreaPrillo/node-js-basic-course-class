const getBooksValidationSchema = {
    schema: {
      body: {
        type: 'object',
        
        properties: {
          isbn: { type: 'string' },
          author: { type: 'string', minLength: 1 }, 
          title: { type: 'string', minLength: 1 }, 
          publicationYear: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            isbn: { type: 'number' },
            author: { type: 'string' },
            title: { type: 'string' },
            publicationYear: { type: 'number' },
          },
        },
        400: {
          type: 'string',
        },
      },
    },
  };
  
  module.exports = {
    getBooksValidationSchema,
  };
  