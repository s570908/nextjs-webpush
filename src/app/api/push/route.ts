import { NextResponse, NextRequest } from 'next/server'
import {
  getSubscriptionsFromDb,
  saveSubscriptionToDb,
} from '@/utils/db/in-memory-db'
import webpush, { PushSubscription } from 'web-push'
import { CONFIG } from '@/config'

webpush.setVapidDetails(
  'mailto:test@example.com',
  CONFIG.PUBLIC_KEY,
  CONFIG.PRIVATE_KEY
)

// we grab the subscription from the request. When calling request.json() we read the JSON contents from the request body.
// When there is a subscription inside the request body we call the saveSubscriptionToDb function to save it into the database.
export async function POST(request: NextRequest) {
  const subscription = (await request.json()) as PushSubscription | null // grab the subscription from the request

  if (!subscription) {
    console.error('No subscription was provided!')
    return
  }

  const updatedDb = await saveSubscriptionToDb(subscription)

  return NextResponse.json({ message: 'success', updatedDb })
}

// This function reads all subscriptions from the database by using the getSubscriptionsFromDb function we created earlier.
// After that, it loops through the subscriptions by using a forEach.
// And it calls the webpush.sendNotification API for each subscriber to send the notification.
export async function GET(_: NextRequest) {
  const subscriptions = await getSubscriptionsFromDb()

  subscriptions.forEach((s) => {
    const payload = JSON.stringify({
      title: 'WebPush Notification!',
      body: 'Hello World',
    })
    webpush.sendNotification(s, payload)
  })

  return NextResponse.json({
    message: `${subscriptions.length} messages sent!`,
  })
}
