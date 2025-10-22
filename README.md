# Book Inventory App - Frontend

A modern Angular application for managing your personal book collection with secure authentication.

## Features

- 🔐 **Secure Authentication** - JWT-based auth with httpOnly cookies
- 📚 **Book Management** - Add, edit, delete, and search books
- 🔍 **ISBN Lookup** - Automatically fetch book details from Google Books API
- 📱 **Responsive Design** - Built with Bootstrap 5
- ⚡ **Modern Angular** - Standalone components with Signals for reactive state management
- 🎨 **Material Design** - Angular Material components for consistent UI
- 🔄 **Reusable Components** - Shared loading states and error alerts for consistent UX

## Tech Stack

- **Angular 19** - Latest version with standalone components
- **TypeScript** - Type-safe development
- **Angular Signals** - Modern reactive state management
- **RxJS** - Reactive programming
- **Bootstrap 5** - Responsive UI framework
- **Angular Material** - Material Design components

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Backend API running (see [Backend Repository](https://github.com/yourusername/book-inventory-api))

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/book-inventory-frontend.git
   cd book-inventory-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Update `src/environments/environment.development.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api', // Your backend API URL
   };
   ```

4. **Run development server**

   ```bash
   ng serve
   ```

5. **Open browser**

   Navigate to `http://localhost:4200`

## Development

### Run development server

```bash
ng serve
```

### Run with custom port

```bash
ng serve --port 4300
```

### Build for production

```bash
ng build --configuration production
```

### Run tests

```bash
ng test
```

### Run linter

```bash
ng lint
```

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core services and interceptors
│   │   ├── guards/
│   │   │   └── auth.guard.ts   # Route protection
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # Adds credentials to requests
│   │   │   └── error.interceptor.ts   # Global error handling
│   │   └── services/
│   │       └── auth.service.ts        # Authentication logic
│   ├── features/               # Feature modules
│   │   ├── auth/              # Login, Register components
│   │   └── books/             # Book list, add, edit components
│   ├── shared/                # Shared components
│   │   └── components/
│   │       ├── navbar/        # Navigation bar
│   │       ├── loading-state/ # Loading spinner component
│   │       └── error-alert/   # Error message display
│   ├── app.component.ts       # Root component
│   ├── app.config.ts          # App configuration
│   └── app.routes.ts          # Route definitions
├── environments/              # Environment configurations
└── assets/                    # Static assets
```

## Key Features Explained

### Authentication

- **httpOnly Cookies** - JWT tokens stored securely in httpOnly cookies (not accessible via JavaScript)
- **Auto Refresh** - Tokens automatically refresh before expiration
- **Route Guards** - Protected routes redirect to login if not authenticated
- **Session Management** - Clear session expired notifications

### State Management

- **Angular Signals** - Reactive state without complex RxJS
- **Computed Values** - Derived state automatically updates
- **Centralized Auth State** - Single source of truth for user authentication

### Shared Components

- **Loading State** - Reusable loading spinner for async operations
- **Error Alert** - Consistent error message display across the app
- **Navbar** - Responsive navigation with authentication state

### HTTP Interceptors

- **Auth Interceptor** - Automatically includes credentials with every request
- **Error Interceptor** - Global error handling with user-friendly messages

## Environment Variables

### Development (`environment.development.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
};
```

### Production (`environment.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api',
};
```

## Available Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm start`     | Start development server    |
| `npm run build` | Build for production        |
| `npm test`      | Run unit tests              |
| `npm run lint`  | Run ESLint                  |
| `npm run watch` | Build and watch for changes |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Backend Repository

This frontend requires the Book Inventory API backend:

- Repository: [Backend Repository](https://github.com/yourusername/book-inventory-api)
- Make sure the backend is running before starting the frontend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Coding Standards

- Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- Use TypeScript strict mode
- Write meaningful commit messages
- Add comments for complex logic
- Use signals for state management
- Keep components focused and small

## Known Issues

- None at the moment

## Future Enhancements

- [ ] Book cover upload
- [ ] Export book list to CSV
- [ ] Dark mode support
- [ ] Advanced filtering and sorting
- [ ] Book recommendations
- [ ] Reading progress tracking

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

[Your Name] - [Your Email]

## Acknowledgments

- [Angular](https://angular.io/) - Framework
- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [Angular Material](https://material.angular.io/) - Material Design components
- [Google Books API](https://developers.google.com/books) - Book data source
