export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications");
    return false;
  }

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showNotification = async (
  title: string,
  body: string,
  url?: string
) => {
  if (Notification.permission !== "granted") {
    const granted = await requestNotificationPermission();
    if (!granted) return;
  }

  const notification = new Notification(title, {
    body,
    data: { url },
    icon: "/logo/LogoIcon.png",
  });

  notification.onclick = (event) => {
    event.preventDefault();
    const targetUrl = notification.data?.url;
    if (targetUrl) {
      window.location.assign(targetUrl);
    }
  };
};
