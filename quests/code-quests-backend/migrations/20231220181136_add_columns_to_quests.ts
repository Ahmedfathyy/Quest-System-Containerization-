import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.jsonb('updates')
        table.jsonb('tasks')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.dropColumn('updates')
        table.dropColumn('tasks')
    })
}

