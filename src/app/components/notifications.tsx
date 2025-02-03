'use client' // this component needs to be rendered on the client side instead of the server side.

import { useState } from 'react'
import Link from 'next/link'
import { CONFIG } from '@/config'
import {
  registerServiceWorker,
  resetServiceWorker,
  unregisterServiceWorkers,
} from '@/utils/sw/service-worker'
import styles from '../page.module.css'
import { Notice } from './notice'

// Because Apple only gives you access to the Notification APIs in the browser when the PWA is installed,
// we need to add some code to check if all the required APIs are accessible.
// Let's extend our component with some boilerplate:
const notificationsSupported = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

export default function Notifications() {
  const [permission, setPermission] = useState(
    window?.Notification?.permission || 'default'
  )

  // We check if we have access to the Notification, serviceWorker and PushManager API.
  // If not, we return a little instruction for the users of our app
  // to let them first install the PWA on their device.
  if (!notificationsSupported()) {
    return (
      <Notice message="Please install this app on your home screen first!" />
    )
  }

  const requestPermission = async () => {
    if (!notificationsSupported()) {
      return
    }

    const receivedPermission = await window?.Notification.requestPermission()
    setPermission(receivedPermission)

    if (receivedPermission === 'granted') {
      subscribe()
    }
  }

  //// (2) click the button to subscribe()
  return (
    <>
      <h3>WebPush PWA</h3>
      <button onClick={subscribe}>Ask permission and subscribe! </button>
    </>
  )

  //   return (
  //     <>
  //       <Notice message={`Notifications permission status: ${permission}`} />
  //       <button onClick={requestPermission} className={styles.button}>
  //         Request permission and subscribe
  //       </button>
  //       <Link href="/debug">Debug options</Link>
  //     </>
  //   )
}

//// (3)-5 Save Subscription
// To be able to receive notifications later on we need to "subscribe" to them.
// Let's create a dedicated function to send the subscription to our backend.
// The backend part we will implement at a later moment in this tutorial.
const saveSubscription = async (subscription: PushSubscription) => {
  // 현재 웹 페이지의 원본 URL을 나타냅니다. 이 속성은 프로토콜, 호스트 이름, 포트 번호를 포함한 URL의 기본 부분을 반환합니다.
  // 예를 들어, 현재 웹 페이지의 URL이 https://example.com:8080/path/page.html이라면,
  // window.location.origin은 https://example.com:8080을 반환합니다.
  const ORIGIN = window.location.origin //
  const BACKEND_URL = `${ORIGIN}/api/push`

  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  })
  return response.json()
}

//// (3) register the Service Worker, subscribe to notifications, and send the subscription to our backend:
//// 1.    First, we unregister all previous known service workers for our app.
//// 2.    Followed by registering the Service Worker again by calling the function we've created earlier.
//// 3.    Then we use the requestPermission method on the browser Notification API to request the user permission to send notifications:
const subscribe = async () => {
  console.log('unregisterServiceWorkers: ')
  //// (3)-1 기존에 등록된 서비스 워커를 모두 해제합니다. 이는 중복된 서비스 워커를 방지하기 위함입니다.
  await unregisterServiceWorkers()

  console.log('registerServiceWorker: ')
  //// (3)-2 새로운 서비스 워커를 등록하고, 그 등록 정보를 swRegistration 변수에 저장합니다.
  const swRegistration = await registerServiceWorker()

  console.log('requestPermission: ')
  //// (3)-3 사용자에게 푸시 알림 권한을 요청합니다. 사용자가 권한을 허용해야 푸시 알림을 받을 수 있습니다.
  await window?.Notification.requestPermission()

  try {
    const options = {
      applicationServerKey: CONFIG.PUBLIC_KEY, // 서버의 공개 키
      userVisibleOnly: true, // 사용자에게 보이는 알림만 허용한다는 의미입니다.
    }

    //// (3)-4 설정된 옵션을 사용하여 푸시 알림 구독을 생성하고, 그 구독 정보를 subscription 변수에 저장합니다.
    const subscription = await swRegistration.pushManager.subscribe(options)

    //// (3)-5 Save Subscription to backend
    await saveSubscription(subscription)

    console.log(':saveSubscription --', { subscription })
  } catch (err) {
    console.error('Error', err)
  }
}
