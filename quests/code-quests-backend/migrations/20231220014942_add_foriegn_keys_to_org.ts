import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('orgs', (table) => {
        table.dropColumn('managerId')
    })
    await knex.schema.alterTable('orgs', (table) => {
        table.integer('managerId').notNullable().references('id').inTable('users').onDelete('CASCADE')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('orgs', (table) => {
        table.dropColumn('managerId')
    })
    await knex.schema.alterTable('orgs', (table) => {
        table.integer('managerId').notNullable()
    })
}

