# NodeVigil

NodeVigil is a web application for monitoring the status of network nodes with a modern, real-time dashboard.

This project is built with Next.js and TypeScript.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed on your machine.

- [Node.js](httpss://nodejs.org/) (v18 or later recommended)
- [npm](httpss://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```sh
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```sh
    cd nodevigil
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
```

This will start the application on `http://localhost:9002` by default. You can now open your browser and navigate to this address to see the application.

## Code Structure

The application code is organized within the `src` directory, following modern Next.js best practices.

-   `src/app/page.tsx`: The main entry point and dashboard layout.
-   `src/components/dashboard/`: Contains all UI components related to the dashboard, such as node cards, charts, and settings panels. This adheres to the principle of keeping UI logic in its own "canvas" through component modularity.
-   `src/hooks/`: Houses custom React hooks, like `use-node-monitoring.ts` which contains the core logic for managing and "pinging" nodes.
-   `src/lib/`: Includes utility functions, type definitions, and other shared library code.
-   `src/app/globals.css`: Defines the global styles and the application's color theme using CSS variables.
