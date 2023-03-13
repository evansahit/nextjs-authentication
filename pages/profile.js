import { getSession } from 'next-auth/client'
import UserProfile from '../components/profile/user-profile'

export default function ProfilePage() {
  return <UserProfile />
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })
  console.log('session from getServerSideProps (profile.js):')
  console.log(session)

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
