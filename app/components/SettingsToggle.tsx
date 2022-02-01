import { useFetcher } from 'remix'
import { settings } from '~/cookies/settings'
import { SettingsItem, DisplayModes, SortorderModes } from '~/types'

export default function SettingsToggle({ setting }: { setting: SettingsItem }) {
  const fetcher = useFetcher()
  return (
    <div className="mt-4">
      <div className="flex items-start justify-between">
        <div className="text-xs font-bold">
          {setting.label}
          {setting.description ? (
            <p className="text-xs font-light">{setting.description}</p>
          ) : null}
        </div>
        <div className="flex flex-shrink-0 divide-x divide-slate-900 overflow-hidden rounded-full ring-1 ring-slate-900 neon:ring-teal-600 dark:ring-slate-100">
          {setting.values.map((v, i) => {
            const isCurrentValue = v === setting.current
            let classList = isCurrentValue
              ? `bg-blue-500 text-blue-800 shadow-inner-md neon:bg-neonf-100`
              : ``
            return (
              <fetcher.Form
                method="post"
                action="/api/settings"
                className="h-full w-full"
                key={i}
              >
                <input type="hidden" name="_action" value="toggleSetting" />
                <input type="hidden" name="setting" value={setting.name} />
                <input type="hidden" name="_value" value={v} />
                <button
                  type="submit"
                  aria-label={v}
                  className={`flex h-8 w-8 items-center justify-center ${classList}`}
                >
                  {setting.icons[i]}
                </button>
              </fetcher.Form>
            )
          })}
        </div>
      </div>
    </div>
  )
}
