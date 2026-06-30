import { useState } from 'react'
import './App.css'

interface Book {
  id: number
  title: string
  author: string
  year: number
  status: 'available' | 'checked-out'
}

function App() {
  const [books, setBooks] = useState<Book[]>([
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, status: 'available' },
    { id: 2, title: '1984', author: 'George Orwell', year: 1949, status: 'available' },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, status: 'checked-out' },
    { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, status: 'available' },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '' })

  const toggleStatus = (id: number) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { ...book, status: book.status === 'available' ? 'checked-out' : 'available' }
        : book
    ))
  }

  const deleteBook = (id: number) => {
    setBooks(books.filter(book => book.id !== id))
  }

  const addBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBook.title && newBook.author && newBook.year) {
      const book: Book = {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        title: newBook.title,
        author: newBook.author,
        year: parseInt(newBook.year),
        status: 'available'
      }
      setBooks([...books, book])
      setNewBook({ title: '', author: '', year: '' })
      setShowAddForm(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>📚 Library Management</h1>
        <p className="subtitle">Manage your book collection</p>
      </header>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{books.length}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{books.filter(b => b.status === 'available').length}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{books.filter(b => b.status === 'checked-out').length}</div>
          <div className="stat-label">Checked Out</div>
        </div>
      </div>

      <div className="controls">
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          {showAddForm ? '✕ Cancel' : '+ Add New Book'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={addBook} className="add-form">
          <h3>Add New Book</h3>
          <input
            type="text"
            placeholder="Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary">Add Book</button>
        </form>
      )}

      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className={`book-card ${book.status}`}>
            <div className="book-header">
              <h3>{book.title}</h3>
              <span className={`status-badge ${book.status}`}>
                {book.status === 'available' ? '✓ Available' : '○ Checked Out'}
              </span>
            </div>
            <p className="author">by {book.author}</p>
            <p className="year">Published: {book.year}</p>
            <div className="book-actions">
              <button 
                onClick={() => toggleStatus(book.id)}
                className="btn-secondary"
              >
                {book.status === 'available' ? 'Check Out' : 'Return'}
              </button>
              <button 
                onClick={() => deleteBook(book.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App