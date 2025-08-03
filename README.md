# ArticleHubFrontend

Welcome to the **ArticleHubFrontend**! This repository houses the user interface for ArticleHub, a modern web application designed to browse, create, and manage articles. Built with cutting-edge frontend technologies, it provides a responsive and intuitive experience for users interacting with the ArticleHub backend.

---

## ✨ Features

* **Intuitive User Interface:** A clean and easy-to-navigate design for article management.
* **Article Browsing:** View a list of articles with details.
* **Article Creation & Editing:** Forms for adding new articles and updating existing ones.
* **User Authentication:** Seamless login and registration flow.
* **Responsive Design:** Optimized for various screen sizes, from mobile to desktop.
* **Fast Development Experience:** Leverages Vite for rapid development and hot module replacement.

---

## 🛠️ Technologies Used

* **React:** A declarative, component-based JavaScript library for building user interfaces.
* **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
* **Vite:** A next-generation frontend tooling that provides an extremely fast development experience.
* **PNPM:** A fast, disk space efficient package manager.
* **ESLint:** For maintaining code quality and consistency.

---

## 🚀 Getting Started

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

* **Node.js** (LTS version recommended)
* **PNPM** (`npm install -g pnpm`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anandpskerala/ArticleHubFrontend.git
    cd ArticleHubFrontend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Variables

If your backend API is not running on the default expected URL (e.g., `http://localhost:5000`), you might need to configure an environment variable. Create a `.env` file in the root directory of the project:

```
VITE_BACKEND_URL=http://localhost:5000/api
```

*Replace `http://localhost:5000/api` with the actual base URL of your ArticleHubBackend API.*

### Running the Application

**Development Mode:**

```bash
pnpm dev
```

This will start the development server, typically accessible at http://localhost:5173 (or another port if 5173 is in use). It includes hot module replacement for a smooth development workflow.

**Production Mode:**

1. **Build the project:**

```bash
pnpm build
```

2. **Preview the production build (optional):**
```bash
pnpm preview
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.

2. Create a new branch (`git checkout -b feature/your-feature-name`).

3. Make your changes.

4. Commit your changes (`git commit -m 'feat: Add new feature'`).

5. Push to the branch (`git push origin feature/your-feature-name`).

6. Open a Pull Request.

## 📄 License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.