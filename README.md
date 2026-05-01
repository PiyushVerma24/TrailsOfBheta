# Trails of Bheta - Reach Us

A React + Vite + Express full-stack web application for the Trails of Bheta tourism platform.

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS
- **Backend:** Express.js (Node.js)
- **UI Components:** Radix UI + shadcn/ui components
- **Styling:** Tailwind CSS v4 + custom animations
- **Maps:** Google Maps integration
- **Package Manager:** pnpm

## Project Structure

```
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # React components (including UI library)
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React Context for theme management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   └── public/             # Static assets
├── server/                 # Express backend
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and constants
│   └── const.ts           # Shared constants
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies

```

## Setup Instructions

### Prerequisites

- Node.js v25+ (installed: v25.6.1)
- pnpm v10+ (installed: v10.4.1)

### Installation

1. **Clone the repository:**
   ```bash
   cd TrailsOfBheta
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run development server:**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   pnpm build
   ```

5. **Start production server:**
   ```bash
   pnpm start
   ```

## Available Scripts

- `pnpm dev` - Start Vite dev server on port 3000
- `pnpm build` - Build React app + compile Express server
- `pnpm start` - Run production build (requires `pnpm build` first)
- `pnpm preview` - Preview production build locally
- `pnpm check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## Key Features

- **Unified Calendar View** - Display trails and booking information
- **Map Integration** - Interactive Google Maps for trail locations
- **Responsive Design** - Mobile-first PWA approach
- **Theme Switching** - Dark/light mode support
- **Accessibility** - Built with Radix UI for a11y

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Environment Variables

Create a `.env.local` file in the root for local development:

```
VITE_API_URL=http://localhost:5000
# Add other env vars as needed
```

## Git Workflow

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make changes, commit, and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## Deployment

The project is configured to deploy on Vercel. Push to the `main` branch to trigger automatic deployments.

## Troubleshooting

### Port already in use
If port 3000 is busy, Vite will automatically find the next available port.

### Dependencies issues
```bash
# Clear pnpm cache and reinstall
pnpm store prune
pnpm install --force
```

### Build fails
```bash
# Check TypeScript errors
pnpm check

# Format code and retry
pnpm format
```

## License

MIT

## Support

For issues or questions, please create an issue on [GitHub](https://github.com/PiyushVerma24/TrailsOfBheta).
