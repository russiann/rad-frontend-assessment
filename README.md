# RAD Frontend Assessment

A modern, full-stack React e-commerce application featuring real-time notifications, AI shopping assistant, and complete shopping cart functionality.

## 🚀 Live Demo

**[View Live Application](https://rad-frontend-assessment.vercel.app)**

The application is deployed on Vercel with a Turso cloud database for optimal performance and reliability.

## Tech Stack

### Frontend
- **React Router 7** - Framework mode for modern routing
- **TypeScript** - Type safety across the application
- **HeroUI** - Component library for consistent UI
- **TailwindCSS** - Utility-first CSS framework
- **Vitest** - Fast unit testing framework

### Backend
- **tRPC** - End-to-end typesafe APIs with built-in SSE support
- **Drizzle ORM** - TypeScript ORM for database operations
- **SQLite** - Lightweight database for development

### APIs
- **Fake Store API** - Product data source
- **OpenAI/Anthropic** - AI assistant functionality

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Database Setup

For development:
```bash
npm run db:generate
npm run db:migrate  
npm run db:seed
```

For production (Turso cloud database):
- Database is automatically configured for Vercel deployment
- Uses environment variables from `vercel.json`
- Migrations and seeding are handled automatically during deployment

## Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:dev
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── common/          # Common components (ErrorAlert, etc.)
│   ├── AiAssistant/     # AI chat functionality
│   └── Layout.tsx       # Main layout component
├── contexts/            # React contexts for global state
├── routes/              # Page components and routing
│   ├── home/           # Product listing page
│   ├── cart/           # Shopping cart page
│   ├── checkout/       # Checkout process
│   ├── product-details/ # Individual product pages
│   └── order-confirmation/ # Order success page
├── utils/              # Utility functions and configurations
└── tests/              # Test setup and utilities

server/
├── db/                 # Database schema and migrations
├── trpc/              # tRPC router and procedures
└── app.ts             # Server configuration
```

## Building for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Assignment Approach

### 1. Technical Approach

- **tRPC** for 100% type-safe APIs with built-in SSE support
- **React Router 7** in Framework Mode for modern routing
- **HeroUI** component library + **TailwindCSS** for styling
- Custom hooks for business logic and React Context for state management

### 2. Challenges Faced

- **Server-Sent Events** for real-time notifications (first time using SSE)
- **AI chat interface** implementation was challenging
- Solved through documentation research and breaking functionality into smaller components

### 3. Future Improvements

- More comprehensive and better quality tests
- Better backend organization
- UI/UX refinements and polish
- Time constraints limited the overall quality I could achieve

## License

MIT License
