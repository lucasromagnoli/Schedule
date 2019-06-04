'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')
const crypto = require('crypto')

class FileController {
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })
      const fileName = `${crypto.randomBytes(10).toString('hex')}.${
        upload.subtype
      }`

      console.log('fileName :', fileName)
      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (error) {
      return response
        .status(error.status || 400)
        .send({ error: { message: 'Algo deu errado no upload', err: error } })
    }
  }

  async show ({ response, params }) {
    try {
      const file = await File.findOrFail(params.id)

      return response.download(Helpers.tmpPath(`uploads/${file.file}`))
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: 'Algo deu errado em visualizar o arquivo',
          err: error
        }
      })
    }
    console.log('file :', file)
  }
}

module.exports = FileController
