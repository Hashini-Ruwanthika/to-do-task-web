# Todo App Frontend

A React + TypeScript frontend application built with Vite.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── api/              # API client functions
├── components/       # React components
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8080/api
```

If not set, the app will use relative paths (`/api`).

