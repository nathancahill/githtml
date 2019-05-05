import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

export default text => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPT_KEY, 'hex'), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}
