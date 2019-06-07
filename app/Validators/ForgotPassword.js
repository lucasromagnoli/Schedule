'use strict'

const Antl = use('Antl')

class ForgotPassword {
  get rules () {
    return {
      email: 'required|email'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ForgotPassword
