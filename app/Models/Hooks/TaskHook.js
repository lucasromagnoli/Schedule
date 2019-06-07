'use strict'

const TaskHook = (exports = module.exports = {})
const Mail = use('Mail')
const Helpers = use('Helpers')

TaskHook.sendNewTaskMail = async taskInstance => {
  if (!taskInstance.user_id || taskInstance.dirty.user_id) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()

  const { title, description, due_date: dueDate } = taskInstance

  await Mail.send(
    ['emails.new_task', 'emails.new_task-text'],
    {
      username,
      hasAttachment: !!file,
      title,
      description,
      dueDate
    },
    message => {
      message
        .to(email)
        .from('no-reply@schedule.com')
        .subject('Nova tarefa para você.')

      if (file) {
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name
        })
      }
    }
  )
}
