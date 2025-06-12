Kasino Labs Technical Test – Mikolaj Zagrodzki
This project is a full-stack cryptocurrency dashboard built with Next.js 15 (App Router), TypeScript, and Tailwind CSS, integrating with the CoinGecko public API. It features server-side rendering for SEO and performance, dynamic pagination, full E2E test coverage, and multi-language support.

- Features

    SSR + CSR: Initial page loads are rendered on the server for instant data and SEO. Pagination and further navigation are handled client-side for a fast, app-like UX.

    Pagination: Users can browse coins page by page (ready for infinite scroll if you want to scale it).

    Coin Details: Clicking a coin shows detailed info, including a chart, supply, and description.

    Loading & Error Handling: Every async interaction has dedicated loading spinners and user-friendly toasts (react-hot-toast) for errors and rate limit warnings.

    Dynamic Routing: Built with Next.js app directory—pages are fully dynamic (/tokens/[page], /token/[id]).

    Coin Icons: All icons are fetched via CoinGecko (with fallbacks).

    TypeScript: Strict typing everywhere, no any used—strong, safe codebase.

    State Management: Global React context for token lists, current page, and loading state. Custom hook for data fetching with retry logic and in-memory caching (for rate limits).

    Multilanguage: Uses next-intl for seamless English/Polish support. Language switcher is cookie-based and reloads UI in place.

    Tailwind CSS: Fully responsive, mobile-first design; UI is clean and adapts to any device.

    E2E Tests: Written in Playwright for critical flows (list, pagination, details, errors, language switching).

    API Rate Limit Handling: Smart retry logic and local cache. Users can plug in a free CoinGecko API key via .env for a higher quota (COINGECKO_API_KEY=CG-MLpov9y6kb7pz4fJxsedCpXy).

    Production-Ready: Deployed on Vercel. OG image/metadata included.

- Live Demo

https://casino-labs-test.vercel.app/ (replace with your real deploy link)

- Setup & Usage

    To run this project locally, follow these steps:

    1. Clone the Repository

    git clone https://github.com/mikzag/mikolaj-zagrodzki-technical-test.git
    cd mikolaj-zagrodzki-technical-test

    2. Install Dependencies

    Requires Node.js 18+ and npm.

    npm install

    3. (Optional) Configure API Key

    By default, the app uses the free CoinGecko API, which has strict rate limits.
    To avoid rate limits, you can use your own CoinGecko demo API key:

    Create a file named .env.local in the project root.

    Add the following line:

    COINGECKO_API_KEY=CG-MLpov9y6kb7pz4fJxsedCpXy

    This will apply your key to all server-side API requests.

    4. Start the Development Server
    
    npm run dev

    Open http://localhost:3000/ in your browser.

    6. Build for Production

    To build and preview the production-ready app locally:

    npm run build
    npm run start

    7. Deploy

    The app is ready for deployment on Vercel (recommended), Netlify, or any platform supporting Next.js v15.

- E2E Coverage

    To run End-to-End (E2E) Tests:

    No need to start the server manually—Playwright will handle it for you!

    Just run:

    npm run test:e2e

    This will cover:

    Loading the List Page and paginating (EN/PL)

    Language switching with live UI reload

    Navigating to the Coin Details Page

    Displaying error states (e.g., fake token/404)

    Verifies real user flows as an end user would see them

- Architecture

    Next.js App Router (src/app/)

    Components: Modular, colocated in components/

    Hooks/context: Token list, loading, pagination via React Context

    API layer: CoinGecko data with server/client separation, caching, and error retries

    TypeScript: All components, API responses, and props strictly typed

    Tailwind: Utility-first classes for layout, color, typography

        Technical Notes
        
        SSR/CSR split: Server-rendered first load for SEO/UX, then hydration and further navigation happens on the client for speed.

        Caching: Server uses in-memory cache for trending/tokens for 30s to reduce API calls (helps with rate limiting).

        Best Practices: All error/loading states are visible and accessible. All icons/images optimized via next/image.

        State Management: Context API for tokens, page, and fetch logic; local state for loading, retry, and error display.

    - Multi-Language

    English & Polish UI.

    User can switch language at any time; persists via cookies.

    - Tradeoffs & Extensions

    Pagination vs Infinite Scroll: The table is paginated, but could easily be adapted for infinite scroll for different UX.

    API Limits: CoinGecko rate limits are handled with retry and cache. For high usage, plug in your own API key.

    Further Polish: Additional animations, loading skeletons, or charting could be added.

    - Assumptions

    CoinGecko API is stable and available for demo/testing.

    Only public API endpoints are used (no authentication needed).

    Polish/English are sufficient for demo.

    - Author
    Mikolaj Zagrodzki
