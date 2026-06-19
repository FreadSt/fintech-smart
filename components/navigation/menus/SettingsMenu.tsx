import { settings } from "@/lib/navbar/nav-consts";
import { Text } from "@/shared/text/Text";

export function SettingsMenu() {
  return (
    <>
      <Text as="h2" className="mb-3 text-sm font-semibold">
        App settings
      </Text>

      <div className="flex flex-col gap-2">
        {settings.map(({ label, value, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-elevated p-3 text-left transition-colors hover:bg-surface"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>

            <span className="min-w-0">
              <Text
                as="span"
                className="block text-sm font-medium"
              >
                {label}
              </Text>

              <Text
                as="span"
                className="block text-xs text-muted"
              >
                {value}
              </Text>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}