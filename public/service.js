//// (3)-2 에서 등록이 된다.
// 서비스 워커는 서버에서 푸시 이벤트를 수신하고 알림을 표시하는 역할을 합니다. 이를 위해 push 이벤트를 수신해야 합니다.
// 이를 위한 이벤트 리스너를 만들어 보겠습니다.
// self refers to the shared Service Worker scope.
// When your PWA is not open on screen there is no window object available
//  so all the communication happens in this Service Worker Scope instead.

// Service Worker는 네트워크 요청을 가로채고, 캐시된 응답을 반환하거나 네트워크를 통해 요청을 처리할 수 있습니다.
self.addEventListener('push', async (event) => {
  if (event.data) {
    const eventData = await event.data.json() // 푸시 이벤트가 들어올 때마다 이벤트 데이터( await event.data.json())를 추출
    showLocalNotification(eventData.title, eventData.body, self.registration)
  }
})

const showLocalNotification = (title, body, swRegistration) => {
  swRegistration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
  })
}

// PWA가 열려 있을 때:
// JavaScript

// // window 객체를 사용하여 알림을 표시
// if (window.Notification && Notification.permission === "granted") {
//   new Notification("PWA가 열려 있습니다!");
// }
// AI가 생성한 코드입니다. 신중하게 검토하고 사용하세요. FAQ의 자세한 정보.
// PWA가 백그라운드에 있을 때:
// JavaScript

// // 서비스 워커 내에서 푸시 알림을 처리
// self.addEventListener('push', function(event) {
//   const data = event.data.json();
//   self.registration.showNotification(data.title, {
//     body: data.body,
//     icon: '/icon.png'
//   });
// });
// AI가 생성한 코드입니다. 신중하게 검토하고 사용하세요. FAQ의 자세한 정보.
// 위 예시에서 볼 수 있듯이, PWA가 열려 있을 때는 window 객체를 통해 알림을 표시할 수 있지만, 백그라운드에서는 서비스 워커가 푸시 알림을 처리합니다.
// 서비스 워커는 PWA가 백그라운드에 있을 때도 계속 실행되며, 네트워크 요청을 캐시하거나 푸시 알림을 처리하는 등의 작업을 수행할 수 있습니다.
