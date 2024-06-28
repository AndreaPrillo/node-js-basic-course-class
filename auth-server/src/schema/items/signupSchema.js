const signupSchema = {
    type: 'object',
    required: ['username', 'password', 'role'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'normal'] },
    },
  };
  
  module.exports = { signupSchema };
  