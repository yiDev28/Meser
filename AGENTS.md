# Agent Instructions: Meser Desktop Application

This repository contains the source code for the Meser Desktop application, an Electron-based project using React, TypeScript, and SQLite.

## Project Structure

```
src/
├── main/                    # Electron main process
│   ├── db/                  # Database connection and models
│   ├── ipc/                 # IPC handlers (main process)
│   ├── models/              # Sequelize models
│   ├── services/            # Business logic services
│   ├── windows/             # Window management (main, splash, print)
│   └── utils/               # Utility functions
├── renderer/                # React renderer process
│   ├── components/          # React components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components
│   ├── modules/             # Feature modules
│   ├── router/              # React Router configuration
│   └── utils/               # Utility functions
├── interfaces/              # TypeScript type definitions
└── utils/                   # Shared utility functions
```

## Build, Lint, and Test Commands

### Development
```bash
npm run dev              # Start development server with hot reload
```

### Linting
Run linting to check for code quality and style:
```bash
npm run lint             # Run ESLint on entire project
npm run lint -- --fix    # Auto-fix linting issues
```

### Building
Build the application for production:
```bash
npm run build           # Build renderer, rebuild SQLite, and create installer
```

### SQLite Rebuild
If database interactions fail, rebuild SQLite native modules:
```bash
npm run rebuild-sqlite  # Rebuild sqlite3 for Electron
```

### Testing
Currently, there are no predefined test scripts in `package.json`. If you need to implement tests:
- Use Vitest for unit tests (works well with Vite)
- Place test files alongside components with `.test.ts` or `.test.tsx` extension
- Run a single test: `npx vitest run <path-to-test-file>`

## Code Style and Best Practices

### TypeScript
- **Strict Mode**: All code must comply with `strict: true` in `tsconfig.json`
- **Type Safety**: Always define return types for functions, especially IPC handlers
- **Interfaces**: Use `interface` for public APIs and types that may be extended
- **No `any`**: Avoid `any` type; use `unknown` when type is truly unknown

### React
- **Functional Components**: Use functional components exclusively
- **Hooks**: Follow hooks rules (`useEffect`, `useState`, etc.)
- **Component Structure**: Keep components modular and focused
- **Context**: Use React Context for global state (see `AuthContext.tsx`, `LoadingContext.tsx`)

### Imports and Paths
- **Absolute Imports**: Use `@/` alias for imports (configured in `tsconfig.json` and `vite.config.ts`)
  ```typescript
  import { User } from "@/main/models/User/UserModel";
  import { Link } from "react-router-dom";
  ```
- **Import Order**: Group imports in this order:
  1. External libraries (react, react-router-dom, etc.)
  2. Internal modules (@/main/*, @/renderer/*)
  3. Relative imports (../../utils)

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Sidebar.tsx`, `InvoiceModel.ts` |
| Hooks | camelCase with use prefix | `useApp.ts`, `useLoading.ts` |
| Variables/Functions | camelCase | `getErrorMessage`, `formatPrice` |
| Types/Interfaces | PascalCase | `RESPONSE<T>`, `UserInterface` |
| Database Models | PascalCase | `UserModel`, `InvoiceModel` |
| Files (utils) | camelCase | `errorUtils.ts`, `dateUtil.ts` |

### Error Handling

#### Main Process
- Always wrap database operations and IPC handlers in try-catch blocks
- Use the `RESPONSE<T>` interface for all IPC return values:
  ```typescript
  import { RESPONSE, NEW_RESPONSE } from "@/interfaces/response";

  ipcMain.handle("some-handler", async (_event, data): Promise<RESPONSE<T>> => {
    try {
      const result = await someOperation(data);
      return NEW_RESPONSE(200, "Success", result);
    } catch (error) {
      console.error("Error in some-handler:", error);
      return NEW_RESPONSE(500, getErrorMessage(error), null);
    }
  });
  ```

#### Renderer Process
- Use `getErrorMessage` utility for safe error message extraction:
  ```typescript
  import { getErrorMessage } from "@/utils/errorUtils";
  ```
- Display user-friendly error messages to users
- Use `LoadingContext` for loading states during async operations

### Database (Sequelize + SQLite)
- Database file is versioned based on `package.json` version: `localdb_{version}.sqlite3`
- Database connection is configured in `src/main/db/db.ts`
- Models are located in `src/main/models/`
- Use `sequelize.sync({ alter: false, force: false })` pattern for migrations
- Define associations in `src/main/db/associations.ts`
- Always use `async/await` for database operations
- Handle connection errors gracefully in `_initDb()`

#### Status Enum
- All tables with a `status` field use the global `STATUS_ENUM` from `src/interfaces/const/status.const.ts`
- Values: `ACTIVE`, `INACTIVE`, `DELETED`, `PENDING`
- Database type: `DataTypes.TEXT` with validation
- Example:
  ```typescript
  import { STATUS_ENUM } from "@/interfaces/const/status.const";

  status: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: STATUS_ENUM.ACTIVE,
    validate: {
      isIn: [Object.values(STATUS_ENUM)],
    },
    field: "usr_status",
  },
  ```

### Electron IPC Communication
- Define handlers in `src/main/ipc/` using `ipcMain.handle()`
- Use preload script to expose safe APIs to renderer via `contextBridge`
- IPC channel naming: use kebab-case (e.g., `"login-user"`, `"get-invoices"`)

### Styling
- Use Tailwind CSS for all styling
- Follow existing color palette (see `tailwind.config` if available)
- Use semantic class names for accessibility

### Logging
- Use `console.log` and `console.error` in main process for debugging
- Include meaningful context in log messages
- Log database connection status and errors

### Environment Variables
- Use `dotenv` for managing environment variables
- Never commit secrets or API keys to the repository
- Use `.env` file for local development (already in `.gitignore`)

### Additional Guidelines
- **No Comments**: Do not add comments unless absolutely necessary for clarity
- **Constants**: Extract magic numbers/strings as constants
- **Async/Await**: Always use async/await over raw promises
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Early Returns**: Use early returns to reduce nesting
