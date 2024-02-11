import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.integer('categoryId')
        table.integer('managerId')
        table.integer('orgId')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.dropColumn('categoryId')
        table.dropColumn('managerId')
        table.dropColumn('orgId')
    })
}

