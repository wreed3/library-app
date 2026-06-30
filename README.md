# Library App

A modern library management application built with React, TypeScript, and Vite.

## Features

- 📚 View and manage your book collection
- ✅ Track book availability (available/checked out)
- ➕ Add new books to the library
- 🗑️ Remove books from the collection
- 📊 Real-time statistics dashboard

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling

## Project Structure

```
library-app/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/
│   └── book.svg         # App icon
├── index.html           # HTML entry point
└── package.json         # Dependencies and scripts
```