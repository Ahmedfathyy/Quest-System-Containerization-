import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.string('title').notNullable()
        table.enum('status', ['draft', 'published', 'archived']).notNullable()
        table.enum('type', ['contest', 'race']).notNullable()
        table.enum('phase', ['registration', 'submission', 'review', 'ended']).notNullable()
        table.string('heroImg')
        table.string('icon')

        table.string('createdOn').notNullable()
        table.string('publishedOn')
        table.string('registrationDeadline').notNullable()
        table.string('submissionDeadline').notNullable()
        table.string('reviewDeadline').notNullable()
        table.string('endedOn')
        table.string('updatedOn')
        table.string('archivedOn')

        table.string('location')
        table.string('maxParticipants')
        table.string('minParticipants')
        table.boolean('isPublic').notNullable()
        table.boolean('requiresApproval').notNullable()

        table.string('description')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('quests', (table) => {
        table.dropColumn('title')
        table.dropColumn('status')
        table.dropColumn('type')
        table.dropColumn('phase')
        table.dropColumn('heroImg')
        table.dropColumn('icon')

        table.dropColumn('createdOn')
        table.dropColumn('publishedOn')
        table.dropColumn('registrationDeadline')
        table.dropColumn('submissionDeadline')
        table.dropColumn('reviewDeadline')
        table.dropColumn('endedOn')
        table.dropColumn('updatedOn')
        table.dropColumn('archivedOn')

        table.dropColumn('location')
        table.dropColumn('maxParticipants')
        table.dropColumn('minParticipants')
        table.dropColumn('isPublic')
        table.dropColumn('requiresApproval')

        table.dropColumn('description')
    })
}

