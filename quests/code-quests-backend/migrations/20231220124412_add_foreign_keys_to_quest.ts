import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.dropColumn('managerId')
        table.dropColumn('orgId')
        table.dropColumn('categoryId')
    })
    await knex.schema.alterTable('quests', (table) => {
        table.integer('managerId').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.integer('orgId').notNullable().references('id').inTable('orgs').onDelete('CASCADE')
        table.integer('categoryId').notNullable().references('id').inTable('categories').onDelete('RESTRICT')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.dropColumn('managerId')
        table.dropColumn('orgId')
        table.dropColumn('categoryId')
    })
    await knex.schema.alterTable('quests', (table) => {
        table.integer('managerId')
        table.integer('orgId')
        table.integer('categoryId')
    })
}

