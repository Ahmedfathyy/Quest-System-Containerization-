import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('categories', (table) => {
        table.string('name').unique().notNullable()
        table.string('description')
        table.string('icon')
        table.string('coverImg')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('categories', (table) => {
        table.dropColumn('name')
        table.dropColumn('description')
        table.dropColumn('icon')
        table.dropColumn('coverImg')
    })
}

