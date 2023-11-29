# TaskStreamr

## Overview
TaskStreamr is a minimalist, yet powerful, task management API built entirely with Node.js. This project stands out by avoiding traditional frameworks like Express.js, focusing instead on leveraging the core capabilities of Node.js to manage and streamline tasks efficiently.

## Features
- **Task Management:** Create, read, update, and delete tasks.
- **CSV Import:** Import tasks in bulk via CSV files.
- **Task Filtering:** Search and filter tasks based on various criteria.
- **Framework-Free Architecture:** Stand out by using core Node.js features for all operations, intentionally avoiding external frameworks to demonstrate the power and flexibility of Node.js itself.

## Getting Started
To get started with TaskStreamr, clone the repository and install the necessary dependencies:

```bash
git clone [repository-link]
cd TaskStreamr
npm install
```

## Usage
Start the server with:

```bash
npm start
```

## Endpoints
POST /tasks: Create a new task.
GET /tasks: List all tasks.
PUT /tasks/:id: Update a task by ID.
DELETE /tasks/:id: Delete a task by ID.
PATCH /tasks/:id/complete: Toggle task completion status.

## Contributing
Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License
TaskStreamr is open-source software licensed under the Mozilla Public License.
