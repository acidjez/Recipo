# Recipo - Online social platform for sharing recipes.

This project is a Vue.js-based web application designed for users to manage, upload and share their recipes.

Currently Deployed at: https://main--dashing-brioche-7082c8.netlify.app/

## Features

- **Recipe Management**:
  - Create, modify, and delete recipes.
  - View detailed recipe cards with ingredients and instructions.
- **Search and Filtering**:
  - Search recipes by keywords.
  - Filter recipes based on specific attributes.
- **Shopping List**:
  - Generate and manage shopping lists based on ingredients added from recipes.
- **User Authentication**:
  - Sign up and log in to manage personal recipes and preferences.
- **Navigation**:
  - Intuitive side navigation for easy access to all features.

## Views and Components

### Components

- **`MyRecipeCardComponent.vue`**:
  - Displays personal recipes with user-specific modifiers.
- **`RecipeCardComponent.vue`**:
  - A general recipe card view for browsing and sharing.
- **`searchBarComponent.vue`**:
  - Provides a search bar for filtering recipes.
- **`SideNav.vue`**:
  - Side navigation component for seamless navigation.

### Views

- **`HomeView.vue`**:
  - Landing page with featured recipes and navigation options.
- **`LoginView.vue`**:
  - User login page for authentication.
- **`SignUpView.vue`**:
  - Registration page for new users.
- **`AddRecipeView.vue`**:
  - Form to add new recipes.
- **`ModifyRecipeView.vue`**:
  - Edit existing recipes.
- **`MyRecipiesView.vue`**:
  - Displays recipes authored by the user.
- **`RecipeView.vue`**:
  - Detailed recipe view with ingredients, instructions, and related actions.
- **`ShoppingListView.vue`**:
  - Manage shopping lists containing ingredients added from recipes.

## Technologies Used

- **Vue.js**: Framework for building the application.
- **Vue Router**: For navigation and routing.
- **CSS**: Styling for UI components.
- **Firebase**: For authentication and data storage.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/recipe-manager.git
   ```

2. Navigate to the project directory:

   ```bash
   cd recipe-manager
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run serve
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### Building for Production

Build the app for production:

```bash
npm run build
```

The optimized production build will be located in the `dist` folder.

## Project Structure

- `src/components`: Contains reusable components like recipe cards, search bars, and side navigation.
- `src/views`: Contains pages/views like home, login, and recipe management.
- `src/router/index.js`: Defines routes for navigation.
- `public`: Static assets (e.g., index.html).
- `package.json`: Project configuration and dependencies.

## Deployment

1. Build the app:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your preferred hosting service (e.g., Netlify, Vercel, or GitHub Pages).

## Author

Developed by [Jeremy Giddings](https://github.com/acidjez).
