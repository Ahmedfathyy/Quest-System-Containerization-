import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', (table) => {
        table.string('handle').unique().notNullable()
        table.string('country')
        table.string('city')
        table.string('avatar')
        table.enum('role', ['admin', 'client', 'contestant']).notNullable()
        table.string('lastLoginOn')
        table.string('lastLoginIP')
        table.boolean('isActive').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('handle')
        table.dropColumn('country')
        table.dropColumn('city')
        table.dropColumn('avatar')
        table.dropColumn('role')
        table.dropColumn('lastLoginOn')
        table.dropColumn('lastLoginIP')
        table.dropColumn('isActive')
    })
}

