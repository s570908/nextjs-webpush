import dynamic from 'next/dynamic'

// By default, Next.js tries to render components on the server. We use a dynamic import with the option ssr: false
// to make sure that Next.js renders the component on the client because we want to access the browser APIs.
const Notifications = dynamic(() => import('@/app/components/notifications'), {
  ssr: false, // Make sure to render component client side to access window and Notification API's
})

//// (1) show notification UI
export default function Home() {
  return <Notifications />
}
