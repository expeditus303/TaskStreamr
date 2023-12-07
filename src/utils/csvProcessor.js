import { createReadStream } from 'node:fs';
import { parse } from 'csv';
import axios from 'axios';

const csvFilePath = './tasks.csv';

async function createTask(task) {
  try {
    const response = await axios.post('http://localhost:5000/tasks', task);
    console.log(`Task created: ${response.data.title}`);
  } catch (error) {
    console.error(`Error creating task: ${error}`);
  }
}

// Stream the CSV file and process each record
const parser = createReadStream(csvFilePath).pipe(parse({
  columns: true, // Use the first line as column headers
  skip_empty_lines: true,
}));

// Using an asynchronous iterator to handle each line of the CSV
for await (const record of parser) {
  // `record` now contains the current line parsed as an object
  // Example: { title: 'Task 01', description: 'Descrição da Task 01' }
  await createTask(record);
}
