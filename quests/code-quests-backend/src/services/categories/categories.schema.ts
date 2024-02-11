// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CategoryService } from './categories.class'

// Main data model schema
export const categorySchema = Type.Object(
  {
    // attribute uniqueness is handled in migrations

    id: Type.Number(),
    name: Type.String(),
    description: Type.Optional(Type.String()),
    icon: Type.Optional(Type.String({ format: 'uri' })),
    coverImg: Type.Optional(Type.String({ format: 'uri' }))
  },
  { $id: 'Category', additionalProperties: false }
)
export type Category = Static<typeof categorySchema>
export const categoryValidator = getValidator(categorySchema, dataValidator)
export const categoryResolver = resolve<Category, HookContext<CategoryService>>({})

export const categoryExternalResolver = resolve<Category, HookContext<CategoryService>>({})

// Schema for creating new entries
export const categoryDataSchema = Type.Pick(categorySchema, ['name', 'description', 'icon', 'coverImg'], {
  $id: 'CategoryData'
})
export type CategoryData = Static<typeof categoryDataSchema>
export const categoryDataValidator = getValidator(categoryDataSchema, dataValidator)
export const categoryDataResolver = resolve<Category, HookContext<CategoryService>>({})

// Schema for updating existing entries
export const categoryPatchSchema = Type.Partial(categorySchema, {
  $id: 'CategoryPatch'
})
export type CategoryPatch = Static<typeof categoryPatchSchema>
export const categoryPatchValidator = getValidator(categoryPatchSchema, dataValidator)
export const categoryPatchResolver = resolve<Category, HookContext<CategoryService>>({})

// Schema for allowed query properties
export const categoryQueryProperties = Type.Pick(categorySchema, ['id', 'name', 'description'])
export const categoryQuerySchema = Type.Intersect(
  [
    querySyntax(categoryQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CategoryQuery = Static<typeof categoryQuerySchema>
export const categoryQueryValidator = getValidator(categoryQuerySchema, queryValidator)
export const categoryQueryResolver = resolve<CategoryQuery, HookContext<CategoryService>>({})
