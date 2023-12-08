import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database)).catch(
      (error) => {
        console.error("Failed to persist data:", error);
      }
    );
  }

  #removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  select(table, filters = {}) {
    const data = this.#database[table] ?? [];
    let results = data;

    if (Object.keys(filters).length) {
      results = data.filter((item) => {
        return;
      });
    }

    if (Object.keys(filters).length) {
      results = data.filter((item) => {
        return Object.entries(filters).every(([key, filterValue]) => {
          const itemValue = item[key]?.toString().toLowerCase();
          return this.#removeAccents(itemValue).includes(
            this.#removeAccents(filterValue.toLowerCase())
          );
        });
      });
    }

    return results;
  }

  insert(table, data) {
    if (!this.#database[table]) {
      this.#database[table] = [];
    }
    this.#database[table].push(data);

    this.#persist();

    return data;
  }

  getById(table, id) {
    try {
      const rowIndex = this.#database[table].findIndex((row) => row.id === id);
      if (rowIndex < 0) return null;
      return this.#database[table][rowIndex];
    } catch (error) {
      console.error("Error in getById:", error);
      return error;
    }
  }

  update(table, id, data) {
    try {
      const rowIndex = this.#database[table].findIndex((row) => row.id === id);
      if (rowIndex > -1) {
        this.#database[table][rowIndex] = { id, ...data };
        this.#persist();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in update:", error);
      return error;
    }
  }

  delete(table, id) {
    try {
      const rowIndex = this.#database[table].findIndex((row) => row.id === id);
      if (rowIndex > -1) {
        this.#database[table].splice(rowIndex, 1);
        this.#persist();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in delete:", error);
      return error;
    }
  }
}
