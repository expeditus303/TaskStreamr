import {randomUUID} from 'node:crypto'
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            const tasks_json = JSON.stringify(tasks)

            return res.end(tasks_json)
        }
    },

    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body

            const current_date = new Date()

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: current_date,
                updated_at: current_date,
                completed_at: null
            }

            database.insert('tasks', task)

            const task_json = JSON.stringify(task)

            return res.writeHead(201).end(task_json)
        }
    }
]