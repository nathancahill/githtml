import url from 'url'
import { Storage } from '@google-cloud/storage'
import { json, createError } from 'micro'

import decrypt from '@githtml/auth/decrypt'
import google from '@githtml/auth/encrypted/google'

const JSON_KEY = JSON.parse(decrypt(google))

const storage = new Storage({
    projectId: JSON_KEY.project_id,
    credentials: {
        client_email: JSON_KEY.client_email,
        private_key: JSON_KEY.private_key,
    },
})

const bucket = storage.bucket('githtml')

export default async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'POST') {
        throw createError(405, 'Method Not Allowed')
    }

    if (req.method === 'GET') {
        const { query } = url.parse(req.url, true)

        if (!query.path) {
            throw createError(400, 'Bad Request')
        }

        const file = bucket.file(query.path)
        let output

        try {
            output = await new Promise((resolve, reject) => {
                const stream = file.createReadStream()
                const chunks = []

                stream.on('data', chunk => {
                    chunks.push(chunk)
                })
                stream.on('end', () => resolve(Buffer.concat(chunks)))
                stream.on('error', e => reject(e))
            })
        } catch (e) {
            console.log(e)
            throw createError(404, 'Not Found')
        }

        return output
    }

    const obj = await json(req)

    // make sure method is post and we have data
    if (!obj.path && !obj.content) {
        throw createError(400, 'Bad Request')
    }

    const file = bucket.file(obj.path)

    try {
        await new Promise((resolve, reject) => {
            const stream = file.createWriteStream({
                resumable: false,
            })

            stream.on('finish', () => resolve())
            stream.on('error', e => reject(e))
            stream.write(obj.content)
            stream.end()
        })
    } catch (e) {
        console.log(e)
        throw createError(500, 'Upload Failed')
    }

    return { success: true }
}
