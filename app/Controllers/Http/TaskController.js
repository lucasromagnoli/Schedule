'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Task = use('App/Models/Task')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   */

  async index ({ params }) {
    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('project')
      .fetch()

    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   */

  async store ({ request, params }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'file_id'
    ])

    const task = await Task.create({ ...data, project_id: params.projects_id })
    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   */

  async show ({ params }) {
    const task = await Task.findOrFail(params.id)

    return task
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   */

  async update ({ params, request }) {
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'file_id'
    ])

    const task = await Task.findOrFail(params.id)
    task.merge(data)

    await task.save()

    return task
  }

  /**
   * Delete a task with id.
   * DELETE projects/:id/tasks/:id
   */

  async destroy ({ params, request, response }) {
    const task = await Task.findOrFail(params.id)

    task.delete()
  }
}

module.exports = TaskController
