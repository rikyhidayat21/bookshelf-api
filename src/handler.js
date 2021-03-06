const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  let finished;
  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  if (name) {
    const searchedBook = books.filter((w) => w.name.toLowerCase().includes(name.toLowerCase()));
    const result = searchedBook.map((s) => ({
      id: s.id,
      name: s.name,
      publisher: s.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    if (reading === '1') {
      const bookResult = books.filter((bk) => bk.reading === true);
      const result = bookResult.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));

      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });
      response.code(200);
      return response;
    }

    const bookResult = books.filter((bkr) => bkr.reading === false);
    const result = bookResult.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    if (finished === '1') {
      const bookResult = books.filter((bk) => bk.finished === true);
      const result = bookResult.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });
      response.code(200);
      return response;
    }

    const bookResult = books.filter((bkr) => bkr.finished === false);
    const result = bookResult.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });
    response.code(200);
    return response;
  }

  const result = books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  return ({
    status: 'success',
    data: {
      books: result,
    },
  });
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
