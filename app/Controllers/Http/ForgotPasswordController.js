'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('no-reply@schedule.com')
            .subject('Solicitação para alterar senha.')
        }
      )
    } catch (error) {
      response.status(error.status).send({
        error: { msg: 'E-mail não encontrado.' }
      })
    }
  }

  async update ({ request, response }) {
    const { token, password } = request.all()

    try {
      const user = await User.findByOrFail('token', token)
      const tokenIsExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenIsExpired) {
        return response
          .status(401)
          .send({ error: { msg: 'Token em questão está vencido.' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      response.status(error.status).send({
        error: { msg: 'Houve um erro ao atualizar a senha.' }
      })
    }
  }
}

module.exports = ForgotPasswordController
