import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

export default encrypted => {
    const iv = Buffer.from(encrypted.iv, 'hex')
    const encryptedText = Buffer.from(encrypted.encryptedData, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPT_KEY, 'hex'), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}
