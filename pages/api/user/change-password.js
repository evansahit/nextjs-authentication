import { getSession } from 'next-auth/client'
import { connectToDatabase } from '../../../lib/db'
import { verifyPassword } from '../../../lib/auth'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  // check is user is authenticated
  // get the email of the authenticated user
  // check if the old password matches the current password in the database
  // replace old password with the new password

  if (req.method !== 'PATCH') {
    return
  }

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ message: 'Not authenticated' })

    return
  }

  const email = session.user.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword
  const newHashedPassword = await hashPassword(newPassword)

  const client = await connectToDatabase()
  const db = client.db()
  const collection = db.collection('users')
  const user = await collection.findOne({ email: email })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    client.close()

    return
  }

  const currentPassword = user.password

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword)

  if (!passwordsAreEqual) {
    res.status(403).json({
      message: 'Old password does not match with your current password',
    })
    client.close()

    return
  }

  const result = await collection.updateOne(
    { email: email },
    { $set: { password: newHashedPassword } }
  )

  client.close()
  res.status(200).json({ message: 'Password updated' })
}
