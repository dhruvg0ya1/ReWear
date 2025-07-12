# ReWear

ReWear is a sustainable fashion platform built with React that enables users to exchange, swap, and give new life to pre-loved clothing. The platform encourages circular fashion, reduces textile waste, and fosters a community of eco-conscious individuals.

# Problem Statement

Fast fashion and textile waste are major environmental concerns. Many people have unused clothing that could be given a second life, but lack a convenient, community-driven way to exchange or donate these items. ReWear addresses this by providing a platform for users to swap, list, and discover pre-loved clothing, promoting sustainable fashion and reducing waste.

# Team

**Team Name:** AI Alchemists

**Members:**
- Dhruv Goyal: dhruvg096@gmail.com
- Sarthak Sharma: dthebass48@gmail.com
- Aman: amanverma1f2003@gmail.com
- Divy Raj: rajdivy10@gmail.com

## Features

- **User Authentication**: Register and log in to access personalized features.
- **Dashboard**: View your points, listed items, and swap activity.
- **Item Listing**: Add, edit, and manage your clothing items for swapping or point redemption.
- **Browse & Search**: Discover items by category, search, and filter listings.
- **Swapping System**: Swap items directly or redeem with points.
- **Admin Panel**: Manage users, items, and swaps with moderation tools (admin only).
- **Responsive UI**: Modern, mobile-friendly design with smooth animations.

## Getting Started

> **Note:** This project requires a React environment. If you have a `package.json`, run `npm install` and `npm start`. Otherwise, ensure you have React and related dependencies set up.

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd rewear
   ```
2. Install dependencies (if `package.json` is present):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Folder Structure

```
rewear/
  ├── App.jsx            # Main app component and router
  ├── App.css            # Global styles
  ├── index.css          # Tailwind or base styles
  ├── main.jsx           # Entry point
  ├── assets/            # Static assets (e.g., images, SVGs)
  ├── components/        # Reusable UI components (Button, Card, Navbar, etc.)
  ├── contents/          # Context providers (AuthContext, ItemContext)
  ├── pages/             # Main pages (Landing, Dashboard, AddItem, AdminPanel, etc.)
  ├── utils/             # Utility functions (e.g., motion.js for animations)
```

## Usage

- **Landing Page**: Learn about the platform, browse featured items, and explore categories.
- **Register/Login**: Create an account or sign in to list and swap items.
- **Dashboard**: Manage your items, view swap history, and track your points.
- **Add Item**: List new clothing items with images, details, and tags.
- **Admin Panel**: (Admins only) Approve/reject items, manage users, and oversee swaps.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
