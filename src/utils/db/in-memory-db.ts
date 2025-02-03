import { PushSubscription } from 'web-push'

type DummyDb = {
  subscriptions: PushSubscription[]
}

export const dummyDb: DummyDb = { subscriptions: [] } // store the subscriptions.

// fake Promise to simulate async call
// add the provided subscription to the dummyDb.subscriptions array.
export const saveSubscriptionToDb = async (
  subscription: PushSubscription
): Promise<DummyDb> => {
  dummyDb.subscriptions.push(subscription)
  return Promise.resolve(dummyDb)
}

// retrieve all subscriptions from memory to be able to send a notification to each subscriber later on.
export const getSubscriptionsFromDb = () => {
  return Promise.resolve(dummyDb.subscriptions)
}
