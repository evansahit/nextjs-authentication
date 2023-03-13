import { MongoClient } from 'mongodb'

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    'mongodb+srv://evans:dUDFvrceHA49DFZF@cluster0.yxeuqvb.mongodb.net/auth-demo?retryWrites=true&w=majority'
  )

  return client
}
