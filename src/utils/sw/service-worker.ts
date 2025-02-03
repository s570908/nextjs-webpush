// Service Worker는 특정 도메인과 일대일로 매핑됩니다. 즉, 하나의 도메인에는 하나의 Service Worker가 존재하며,
// 해당 도메인의 모든 페이지는 동일한 Service Worker를 공유합니다

//// (3)-2 register the Service Worker:
// This function registers the service worker we created earlier.
// It "connects" our frontend to the Service Worker and after calling it we can communicate with it.
export const registerServiceWorker = async () => {
  console.log('navigator.serviceWorker.register: ')
  // Service Worker는 특정 도메인에 대해 한 번만 등록됩니다. 등록된 Service Worker는 해당 도메인의 모든 페이지에서 공유됩니다.
  return navigator.serviceWorker.register('/service.js')
}

// (3)-1 Unregistering all service workers
// To make development and debugging easier, we will implement a function to unregister all service workers in our app.
// This helps when you are changing the code of the service worker later on.
// Normally you have to manually unregister the service worker by using the developer tools of your webbrowser,
// but we will do it programmatically:
export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((r) => r.unregister()))
}

export const resetServiceWorker = async () => {
  await unregisterServiceWorkers()
  return registerServiceWorker()
}
