import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/buildRoutePath.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { title, description } = req.query;
      const decodedTitle = title ? decodeURIComponent(title) : undefined;
      const decodedDescription = description ? decodeURIComponent(description) : undefined;
      
      const filters = {};
      if (decodedTitle) filters.title = decodedTitle;
      if (decodedDescription) filters.description = decodedDescription;

      const tasks = await database.select("tasks", filters);

      const tasks_json = JSON.stringify(tasks);

      return res.end(tasks_json);
    },
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(
            "Request invalid: both 'title' and 'description' must be provided"
          );
      }

      const current_date = new Date();

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: current_date,
        updated_at: current_date,
        completed_at: null,
      };

      await database.insert("tasks", task);

      const task_json = JSON.stringify(task);

      return res.writeHead(201).end(task_json);
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { title, description } = req.body;
      const { id } = req.params;

      if ((title && description) || (!title && !description)) {
        return res
          .writeHead(400)
          .end(
            "Request invalid: either 'title' or 'description' must be provided."
          );
      }

      const task = await getTaskOrRespondNotFound(id, res);
      if (!task) return;

      const current_date = new Date();

      const updatedTask = { ...task, updated_at: current_date };
      if (title) updatedTask.title = title;
      if (description) updatedTask.description = description;

      try {
        await database.update("tasks", id, updatedTask);
        const taskJson = JSON.stringify(updatedTask);
        return res.writeHead(200).end(taskJson);
      } catch (error) {
        console.error("Error updating task:", error);
        return res
          .writeHead(500)
          .end("Internal Server Error: unable to update task.");
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;

      const task = await getTaskOrRespondNotFound(id, res);
      if (!task) return;

      try {
        await database.delete("tasks", id);

        return res
          .writeHead(200)
          .end(`Task with ID ${id} has been permanently deleted`);
      } catch (error) {
        console.error("Error deleting task:", error);
        return res
          .writeHead(500)
          .end("Internal Server Error: unable to update task.");
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;

      const task = await getTaskOrRespondNotFound(id, res);
      if (!task) return;

      const current_date = new Date();

      const updatedTask = {
        ...task,
        completed_at: !task.completed_at ? current_date : null,
      };

      try {
        await database.update("tasks", id, updatedTask);
        const taskJson = JSON.stringify(updatedTask);
        return res.writeHead(200).end(taskJson);
      } catch (error) {
        console.error("Error completing task:", error);
        return res
          .writeHead(500)
          .end("Internal Server Error: unable to complete task.");
      }
    },
  },
];

async function getTaskOrRespondNotFound(id, res) {
  const task = await database.getById("tasks", id);
  if (!task) {
    res
      .writeHead(404)
      .end(`Task not found: no task exists with the provided ID: ${id}.`);
    return null;
  }
  return task;
}
