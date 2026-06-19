import { notifications } from "@/lib/navbar/nav-consts";
import { Text } from "@/shared/text/Text";

export function NotificationsMenu() {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <Text as="h2" className="text-sm font-semibold">
          Notifications
        </Text>

        <Text as="span" className="text-xs text-primary">
          3 new
        </Text>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.title}
            className="rounded-2xl border border-border/60 bg-surface-elevated p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <Text as="h3" className="text-sm font-medium">
                {notification.title}
              </Text>

              <Text
                as="span"
                className="shrink-0 text-xs text-muted"
              >
                {notification.time}
              </Text>
            </div>

            <Text className="mt-1 text-xs leading-5 text-muted">
              {notification.description}
            </Text>
          </div>
        ))}
      </div>
    </>
  );
}