# Professional Order Book Trading Interface

A high-performance, real-time order book application built with Next.js, TypeScript, and Tailwind CSS. Features live WebSocket data integration, custom design system, and professional trading interface inspired by Hyperliquid.

🔗 **Live Demo:** [https://full-stack-order-book.vercel.app](https://full-stack-order-book.vercel.app)

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
│   │   ├── OrderRow.tsx       # Individual order row
│   │   └── index.ts           # Component exports
│   ├── contexts/               # React Context
│   │   ├── OrderBookContext.tsx # Context types & hook
│   │   ├── OrderBookProvider.tsx # WebSocket provider
│   │   └── index.ts           # Context exports
│   ├── constants/              # Application constants
│   │   ├── index.ts           # Constant exports
│   │   ├── orderBook.ts       # Order book constants
│   │   ├── precision.ts       # Precision constants
│   │   ├── spreadGroupings.ts # Spread grouping options
│   │   └── symbols.ts         # Trading symbols
│   ├── design-system/          # Custom design system
│   │   ├── Button.tsx         # Button component
│   │   ├── Select.tsx         # Select component
│   │   ├── Card.tsx           # Card component
│   │   ├── Container.tsx      # Container component
│   │   ├── Input.tsx          # Input component
│   │   ├── StatusIndicator.tsx # Status indicator
│   │   ├── Badge.tsx          # Badge component
│   │   ├── ProgressBar.tsx    # Progress bar component
│   │   ├── RatioIndicator.tsx # Ratio indicator component
│   │   ├── ControlBar.tsx     # Control bar component
│   │   ├── HeaderBar.tsx      # Header bar component
│   │   ├── FooterBar.tsx      # Footer bar component
│   │   ├── TableHeader.tsx    # Table header component
│   │   ├── InfoRow.tsx        # Info row component
│   │   ├── Tabs.tsx           # Tabs component
│   │   └── index.ts           # Design system exports
│   ├── utils/                  # Utility functions
│   │   ├── index.ts           # Utils exports
│   │   ├── orderBookHelpers.ts # Order book utilities
│   │   └── orderBookHelpers.test.ts # Unit tests (59 tests)
│   └── public/                 # Static assets
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Real-time Data**: WebSocket (Hyperliquid API)
- **Component Library**: Custom Design System
- **Testing**: Vitest with 59 unit tests (99.29% utils coverage)
- **Linting**: ESLint

## 🎨 Design System

Our custom design system provides consistent, reusable components:

### Components

- **Button**: 4 variants (primary, secondary, ghost, danger), 3 sizes
- **Select**: MUI-style dropdown with options array API, custom dropdown UI, label support with left/top positioning
- **Card**: 3 variants (default, elevated, outlined), 4 padding options
- **Input**: With icons, labels, and error handling
- **StatusIndicator**: 4 status types (connected, disconnected, demo, error)
- **Badge**: Circular badges with 5 variants and 3 sizes
- **ProgressBar**: Dual-colored progress bars for ratios and metrics
- **RatioIndicator**: Display ratios with labels and progress bar
- **ControlBar**: Container for filter/control inputs
- **HeaderBar**: Header bar component for consistent styling
- **FooterBar**: Footer bar component for consistent styling
- **TableHeader**: Column headers for data tables
- **InfoRow**: Separator/info rows with consistent styling
- **Container**: Centered content container with max-width options
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

## 💡 Technical Highlights

### Performance Optimizations

- **Efficient Re-renders**: React.memo optimization for OrderRow components to prevent unnecessary re-renders
- **Memoized Computations**: useMemo for expensive operations like array reversals
- **Smooth Animations**: CSS transitions with overflow protection to prevent visual glitches
- **Memory Management**: Proper cleanup of WebSocket connections and intervals
- **State Synchronization**: Real-time data updates without flickering or intermediate states
- **Color Optimization**: Pre-computed color constants to avoid object recreation

### Advanced Features

- **Dynamic Spread Calculation**: Real-time percentage calculation based on selected grouping
- **Cumulative Size Visualization**: Accurate depth bar rendering with proper scaling
- **Fallback Data Generation**: Sophisticated mock data that mimics real market behavior
- **Connection Resilience**: Automatic reconnection with exponential backoff

### Code Quality

- **TypeScript**: Strict typing with comprehensive interfaces
- **Component Architecture**: Modular, reusable components with single responsibilities
- **Error Handling**: Graceful degradation and comprehensive error boundaries
- **Accessibility**: Full keyboard navigation and screen reader support

## 🧪 Testing

### Unit Tests

- **Framework**: Vitest
- **Coverage**: 99.29% for utility functions
- **Test Files**: 59 tests covering all utility functions

### Test Coverage

```bash
npm run test:coverage
```

**Coverage Report:**

- Formatting functions (formatPrice, formatSize, formatTotal)
- Data transformation (calculateCumulativeSizes, calculateMaxSize)
- Depth bar calculations (getDepthBarWidth)
- Price change animations (getPriceChangeClass)
- Order colors (getOrderColors)
- Demo data generation (updateOrderSize, generateGroupedOrders)
- WebSocket data processing (processHyperliquidOrders)
- Volume ratio calculations (calculateVolumeRatios)
- Spread metrics calculations (calculateSpreadMetrics)

### Running Tests

```bash
npm run test         # Run all tests
npm run test:watch   # Watch mode for development
npm run test:coverage # Generate coverage report
```

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

### ✅ Core Features

- **Real-time Order Book**: Live WebSocket data with visual depth bars and smooth animations
- **Multi-Symbol Support**: Switch between BTC and ETH with dynamic precision control
- **Professional UI**: Hyperliquid-inspired design with muted colors and bright price change indicators
- **Spread Management**: Configurable spread grouping (1, 5, 10, 25, 50, 100, 500) with dynamic percentage calculation
- **Visual Depth**: Cumulative size visualization with smooth transitions and overflow protection
- **Connection Management**: Auto-reconnection, fallback data, and connection status indicators
- **Responsive Design**: Optimized for desktop trading interfaces
- **Type Safety**: Full TypeScript coverage with proper interfaces and error handling

### 🚧 Coming Soon

- **Order Placement**: Buy/sell order functionality
- **Trade History**: Historical trade data display
- **Advanced Charts**: Price charts and technical indicators
- **User Authentication**: User accounts and preferences
- **Multiple Exchanges**: Support for additional trading venues

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:coverage # Run tests with coverage report
npm run test:watch   # Run tests in watch mode
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
