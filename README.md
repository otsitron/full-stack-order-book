# Full-Stack Order Book

A professional real-time order book application built with Next.js, TypeScript, and Tailwind CSS. Features live WebSocket data from Hyperliquid, a custom design system, and modular component architecture.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
full-stack-order-book/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/             # React components
│   │   ├── OrderBook.tsx      # Main order book container
│   │   ├── OrderBookHeader.tsx # Header with controls
│   │   ├── OrderBookTable.tsx  # Order book table
│   │   ├── OrderBookControls.tsx # Bottom controls
│   │   ├── OrderRow.tsx       # Individual order row
│   │   └── index.ts           # Component exports
│   ├── contexts/               # React Context
│   │   ├── OrderBookContext.tsx # Context types & hook
│   │   ├── OrderBookProvider.tsx # WebSocket provider
│   │   └── index.ts           # Context exports
│   ├── design-system/          # Custom design system
│   │   ├── Button.tsx         # Button component
│   │   ├── Select.tsx          # Select component
│   │   ├── Card.tsx            # Card component
│   │   ├── Input.tsx           # Input component
│   │   ├── StatusIndicator.tsx # Status indicator
│   │   ├── Tabs.tsx            # Tabs component
│   │   └── index.ts            # Design system exports
│   └── public/                 # Static assets
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Real-time Data**: WebSocket (Hyperliquid API)
- **Component Library**: Custom Design System
- **Linting**: ESLint

## 🎨 Design System

Our custom design system provides consistent, reusable components:

### Components

- **Button**: 4 variants (primary, secondary, ghost, danger), 3 sizes
- **Select**: With labels, error states, and validation
- **Card**: 3 variants (default, elevated, outlined), 4 padding options
- **Input**: With icons, labels, and error handling
- **StatusIndicator**: 4 status types (connected, disconnected, demo, error)
- **Tabs**: Full accessibility support with keyboard navigation

### Features

- **TypeScript Support**: Full type safety with proper interfaces
- **Accessibility**: ARIA attributes, keyboard navigation, focus management
- **Consistent Styling**: Unified color palette, spacing, and typography
- **Dark Theme**: Professional trading interface design
- **Responsive**: Mobile-friendly with Tailwind's responsive utilities

## 🔌 WebSocket Integration

### Real-time Data

- **Live Order Book**: Real-time bid/ask data from Hyperliquid
- **Symbol Support**: BTC and ETH trading pairs
- **Precision Control**: Adjustable decimal places (0-4)
- **Fallback Mode**: Demo data when WebSocket fails
- **Auto-reconnection**: Automatic reconnection with retry logic

### Features

- **Connection Status**: Visual indicators (Connected/Demo Mode/Disconnected)
- **Error Handling**: Graceful degradation with fallback data
- **Performance**: Optimized re-renders and state management
- **Visual Feedback**: Price change animations and depth visualization

## 🏗️ Architecture

### Component Architecture

- **Modular Design**: Small, focused components with single responsibilities
- **Context API**: Centralized state management for order book data
- **Custom Hooks**: Reusable logic with `useOrderBook` hook
- **Type Safety**: Full TypeScript coverage with proper interfaces

### State Management

- **React Context**: Centralized order book state
- **WebSocket Provider**: Handles connection, data processing, and fallbacks
- **Optimized Updates**: Minimal re-renders with proper dependency arrays
- **Error Boundaries**: Graceful error handling and recovery

## 🎯 Features

### ✅ Implemented

- **Real-time Order Book**: Live WebSocket data with visual depth bars
- **Symbol Selection**: Switch between BTC and ETH
- **Precision Control**: Adjustable decimal places
- **Visual Feedback**: Price change animations and smooth transitions
- **Connection Management**: Auto-reconnection and fallback data
- **Professional UI**: Dark theme with trading-focused design
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

### 🚧 Coming Soon

- **Order Placement**: Buy/sell order functionality
- **Trade History**: Historical trade data display
- **Advanced Charts**: Price charts and technical indicators
- **User Authentication**: User accounts and preferences
- **Multiple Exchanges**: Support for additional trading venues

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔧 Development

### Adding New Components

1. Create component in `src/design-system/`
2. Add TypeScript interfaces
3. Export from `src/design-system/index.ts`
4. Use in components with proper imports

### WebSocket Configuration

- **Endpoint**: `wss://api.hyperliquid.xyz/ws`
- **Subscription**: `l2Book` type with symbol and precision
- **Reconnection**: 3-second retry interval
- **Timeout**: 10-second connection timeout

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow design system patterns
- Maintain dark theme consistency
- Ensure accessibility compliance

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [Hyperliquid](https://hyperliquid.xyz/) for WebSocket API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [TypeScript](https://www.typescriptlang.org/) for type safety
