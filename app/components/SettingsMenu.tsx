import { Link } from 'remix'
import { useRef, useContext, PointerEventHandler } from 'react'
import { AppContext } from '~/context/AppContext'
import CurrentUser from './CurrentUser'
import LoginForm from './LoginForm'
import { SettingsItem, DisplayModes, SortorderModes, Logo } from '~/types'
import SettingsToggle from './SettingsToggle'

export default function SettingsMenu() {
  const { currentUser, isMenuOpen, settings, setMenuOpen } =
    useContext(AppContext)

  const availableSettings: SettingsItem[] = [
    {
      name: `theme`,
      label: 'Dark Mode',
      values: [`light`, `dark`, `neon`],
      current: settings.theme ?? `dark`,
      icons: [
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>,
      ],
    },
    {
      name: `displayMode`,
      label: 'Darstellung',
      description: 'Schaltet zwischen 3-Frame und Inline Darstellung um',
      values: [DisplayModes.frames, DisplayModes.inline],
      current: settings.displayMode ?? DisplayModes.frames,
      icons: [
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>,
      ],
    },
    {
      name: `sortOrder`,
      label: 'Sortierung',
      description: 'Standardssortierung oder neueste Äste zuerst',
      values: [SortorderModes.default, SortorderModes.newest],
      current: settings.sortOrder ?? SortorderModes.default,
      icons: [
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
          />
        </svg>,
      ],
    },
    {
      name: `logo`,
      label: 'Angezeigtes Logo',
      description: `Habe ich alle selber nachgebaut.`,
      values: [Logo.new, Logo.old],
      current: settings.logo ?? Logo.new,
      icons: [
        <svg
          viewBox="0 0 280 280"
          className="h-4 w-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 249V31h51l30 96h2l29-96h51v218h-48V145l-18 84H86l-16-84v104H21ZM259 31h-59v155h51l8-155ZM250 204h-50v45h48l2-45Z"
            fill="currentColor"
          />
        </svg>,
        <svg
          viewBox="0 0 280 280"
          className="h-4 w-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M57 245H13v-48h10V84H13V35h72l22 79 15-79h65v49h-9v113h9v48h-58v-48h9l-2-106-35 154H83L48 91v106h9v48ZM268 35h-68l2 49h8l4 94h42l3-94h7l2-49ZM264 196h-60v49h60v-49Z"
            fill="currentColor"
          />
        </svg>,
      ],
    },
  ]
  const menuRef = useRef<HTMLDivElement>(null)

  const onClickOutside: PointerEventHandler<HTMLDivElement> = (e) => {
    if (
      e.target === menuRef.current ||
      menuRef.current?.contains(e.target as Node)
    ) {
      return
    } else {
      e.preventDefault()
      setMenuOpen(false)
    }
  }

  return (
    <div
      className={`absolute inset-0 transform-gpu bg-gray-50/50 filter backdrop-blur-sm transition-all duration-200 neon:bg-neonb-900/50 dark:bg-slate-900/50 ${
        isMenuOpen ? `z-20 scale-100 opacity-100` : `scale-80 -z-10 opacity-0`
      }`}
      onClick={onClickOutside}
    >
      <div className="flex h-full w-full items-start justify-end">
        <div
          className="w-3/4 max-w-xs border border-slate-900 bg-gray-50 shadow-md neon:border-neonf-100 neon:bg-neonb-700 dark:border-gray-100 dark:bg-slate-900 md:p-4 lg:max-w-md"
          ref={menuRef}
        >
          <div className="border-b p-2">
            {currentUser ? <CurrentUser user={currentUser} /> : <LoginForm />}
          </div>
          <div className="p-2">
            <h2 className="text-xs font-bold">Einstellungen</h2>
          </div>
          <div className="border-b p-2">
            {availableSettings.map((s, index) => (
              <SettingsToggle setting={s} key={index} />
            ))}
          </div>
          <div className="p-2">
            <Link
              to={`/about`}
              onClick={() => setMenuOpen(false)}
              className="text-xs"
            >
              Über diese App
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
