const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});



async function storeTheBook(author, title, publicaitonYear) {
  const client = await pool.connect();
  const generateIsbn = () => {
    const uuid = uuidv4();
    return uuid.substring(0, 11);
  };
  try {
    const query = 'INSERT INTO books (author, title, publicationyear,isbn) VALUES ($1, $2, $3, $4)';
    await client.query(query, [author, title, publicaitonYear, "d4dsd"]);
    console.log('Book stored successfully');
  } catch (err) {
    console.error('Error storing book', err);
  } finally {
    client.release();
  }
}

async function getAllBooks(query) {
  const client = await pool.connect();
  try {
    const { author, publicationyear, sort = 'DESC', page = 1 } = query;

    console.log({ author, publicationyear, sort , page  });
    const limit = 10;
    const offset = (page - 1) * limit;

    let baseQuery = 'SELECT * FROM books';
    let filterConditions = [];
    let params = [];
    let paramIndex = 1;

    if (author) {
      filterConditions.push(`author ILIKE $${paramIndex++}`);
      params.push(`%${author}%`);
    }

    if (publicationyear) {
      filterConditions.push(`publicationyear = $${paramIndex++}`);
      params.push(publicationyear);
    }

    if (filterConditions.length > 0) {
      baseQuery += ' WHERE ' + filterConditions.join(' AND ');
    }

    baseQuery += ` ORDER BY publicationyear ${sort}`;
    baseQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    const res = await client.query(baseQuery, params);
    return res.rows;
  } catch (err) {
    console.error('Error retrieving books', err);
    return [];
  } finally {
    client.release();
  }
}


async function getBookById(id) {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM books WHERE id = $1';
    const values = [id];
    const res = await client.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error retrieving book', err);
    return null;
  } finally {
    client.release();
  }
}

async function deleteBookById(id) {
  const client = await pool.connect();
  try {
    const query = 'DELETE FROM books WHERE id = $1 RETURNING *';
    const values = [id];
    const res = await client.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error deleting book', err);
    return null;
  } finally {
    client.release();
  }
}

async function updateBookById(id, updates) {
  const client = await pool.connect();
  try {
    const { isbn, author, title, publicationYear :publicationyear  } = updates;

    console.log("id",id);
    const query = `
        UPDATE books 
        SET isbn = $1, author = $2, title = $3, "publicationyear" = $4 
        WHERE id = $5 RETURNING *`;
  const values = [isbn, author, title, publicationyear, id];
    const res = await client.query(query, values);
    console.log("res",res);

    return res.rows[0];
  } catch (err) {
    console.error('Error updating book', err);
    return null;
  } finally {
    client.release();
  }
}

async function getBooksByAuthorAndYear(author, publicationyear, page = 1) {
  const client = await pool.connect();
  try {
    const limit = 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM books 
      WHERE author ILIKE $1 AND "publicationyear" = $2
      ORDER BY "publicationyear" DESC
      LIMIT $3 OFFSET $4
    `;
    const values = [`%${author}%`, publicationyear, limit, offset];
    const res = await client.query(query, values);
    return res.rows;
  } catch (err) {
    console.error('Error retrieving books', err);
    return [];
  } finally {
    client.release();
  }
}


module.exports = {
  storeTheBook,
  getBookById,
  getAllBooks,
  deleteBookById,
  updateBookById,
  getBooksByAuthorAndYear
}