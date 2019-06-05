'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileTaskSchema extends Schema {
  up () {
    this.create('file_task', table => {
      table
        .integer('file_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('task_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tasks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('file_task')
  }
}

module.exports = FileTaskSchema
