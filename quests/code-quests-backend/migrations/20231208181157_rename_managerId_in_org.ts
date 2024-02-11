import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('orgs', (table) => {
        table.renameColumn('manager', 'managerId')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('orgs', (table) => {
        table.renameColumn('managerId', 'manager')
    })
}

