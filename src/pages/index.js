
import { router } from 'next/router'
import {useEffect} from 'react' 

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
      router.push("auth/login");
  }, [])
  return (
    <>
    </>
  )
}
