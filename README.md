# Markdown Notes Application

A professional full-stack notes application featuring real-time markdown preview, persistent storage, and secure user authentication.

## 🚀 Features

- **Personalized Notes**: Secure signup/login to keep your notes private.
- **Markdown Mastery**: Full support for headings, bold, italic, code blocks, and more.
- **Real-time Preview**: Split-screen editor showing instant formatting as you type.
- **Smart Search**: Quickly find notes based on titles or content snippets.
- **Premium Aesthetics**: 
  - Dark/Light mode support.
  - Responsive design (Mobile & Desktop).
  - Modern typography and smooth interactions.
- **Reliable Storage**: Powered by a unified SQL backend (SQLite).

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, Lucide Icons, React-Markdown.
- **Backend**: Node.js, Express, JWT, Bcrypt.js.
- **Database**: SQLite (SQL).

## 📦 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd markdown-notes-app
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Create a .env file (optional)
   # PORT=5000
   # JWT_SECRET=your_secret_key
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

### Running Locally

- Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.
- The backend runs on [http://localhost:5000](http://localhost:5000).

## 📂 Project Structure

```text
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth state management
│   │   ├── hooks/       # Custom hooks (debounce, etc.)
│   │   └── styles/      # Global themes and CSS
├── server/          # Express backend
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth protection
│   └── database.js  # SQLite configuration
└── README.md
```

## 📝 License

This project is licensed under the MIT License.
