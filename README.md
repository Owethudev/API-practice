# TaskForge API

Minimal Task REST API built with Express.

Prerequisites

- Node.js v16+ (or modern LTS)
- npm

Install

```bash
npm install
```

Run

```bash
# start normally
node server.js

# or with nodemon for development
npm run dev
```

API Endpoints

- GET /tasks — list all tasks
- GET /tasks/:id — get a single task
- POST /tasks — create a task (JSON or form). Body: `{ "title": "My task" }`
- PUT /tasks/:id — update a task. Body: `{ "title": "Updated", "complete": true }`
- DELETE /tasks/:id — delete a task
- GET /tasks/:id/verify — simulated slow external check (1.5s). Returns 400 if a required field is missing.

Data persistence

- Tasks are stored in `data/tasks.json` and persist between runs.
- `data/tasks.json` includes a seeded broken task (missing `title`) to exercise `/verify` error handling.

Smoke-test examples

```bash
# list
curl http://localhost:3000/tasks

# create (JSON)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task"}'

# create (form)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Form+task"

# update (replace <id>)
curl -X PUT http://localhost:3000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","complete":true}'

# verify (valid id)
curl http://localhost:3000/tasks/<id>/verify

# verify (seeded broken task id is task-4)
curl http://localhost:3000/tasks/task-4/verify
```

Static UI

- A simple page at `/` is served from `public/index.html` and fetches `/tasks`.

Error handling

- Centralized error middleware in `middleware/errorHandler.js` returns JSON errors and handles malformed JSON.

Project structure

```
taskforge-api/
├── server.js
├── routes/
│   └── tasks.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
├── data/
│   └── tasks.json
├── public/
│   └── index.html
├── package.json
└── README.md
```
