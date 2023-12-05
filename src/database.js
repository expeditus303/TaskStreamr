import fs from 'node:fs/promises'

const databasePath = new URL("../db.json", import.meta.url)

export class Database {
    #database = {}
}