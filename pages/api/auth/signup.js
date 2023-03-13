import { connectToDatabase } from '../../../lib/db'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return

  const { email, password } = req.body
  const hashedPassword = await hashPassword(password)

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long',
    })
  }

  const client = await connectToDatabase()

  const db = client.db()

  const existingUser = await db.collection('users').findOne({ email: email })

  if (existingUser) {
    res
      .status(422)
      .json({ message: 'User with this email address already exists' })
    client.close()

    return
  }

  db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  })

  res.status(201).json({ message: 'Successfully created user!' })

  client.close()
}
