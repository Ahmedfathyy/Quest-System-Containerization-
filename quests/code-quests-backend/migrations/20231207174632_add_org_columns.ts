import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('orgs', (table) => {
        table.string('name').unique().notNullable()
        table.string('description')
        table.string('logo')
        table.string('phone')
        table.string('website')
        table.boolean('isVerified').notNullable()
        table.boolean('isActive').notNullable()
        table.boolean('isPublic').notNullable()
        table.integer('manager').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('orgs', (table) => {
        table.dropColumn('name')
        table.dropColumn('description')
        table.dropColumn('logo')
        table.dropColumn('phone')
        table.dropColumn('website')
        table.dropColumn('isVerified')
        table.dropColumn('isActive')
        table.dropColumn('isPublic')
        table.dropColumn('manager')
    })
}

