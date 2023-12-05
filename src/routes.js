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
        
    }
]