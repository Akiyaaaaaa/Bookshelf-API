const { nanoid } = require('nanoid')
const books = require('./books')
const addBook = (request, resp) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }
  if (!name) {
    const response = resp.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (pageCount < readPage) {
    const response = resp.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = resp.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }
  const response = resp.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku'
  })
  response.code(500)
  return response
}

const getAllBook = (request, resp) => {
  const { name, reading, finished } = request.query
  if (books.length >= 0) {
    let getBook = books
    if (name !== undefined) {
      getBook = getBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    }
    if (reading !== undefined) {
      getBook = getBook.filter((book) => Number(book.reading) === Number(reading))
    }
    if (finished !== undefined) {
      getBook = getBook.filter((book) => Number(book.finished) === Number(finished))
    }
    const response = resp.response({
      status: 'success',
      data: {
        books: getBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else {
    const response = resp.response({
      status: 'success',
      data: []
    })
    response.code(200)
    return response
  }
}

const getBookById = (request, resp) => {
  const { bookId } = request.params
  const book = books.filter((n) => n.id === bookId)[0]
  if (book !== undefined) {
    const response = resp.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
  const response = resp.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookById = (request, resp) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)
  if (index !== -1) {
    if (!name) {
      const response = resp.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }
    if (readPage > pageCount) {
      const response = resp.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }
    const finished = readPage === pageCount
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }
    const response = resp.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        books
      }
    })
    response.code(200)
    return response
  }
  const response = resp.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}
const deleteBook = (request, resp) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)
  if (index !== -1) {
    books.splice(index, 1)
    const response = resp.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = resp.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBook, getAllBook, getBookById, editBookById, deleteBook }
