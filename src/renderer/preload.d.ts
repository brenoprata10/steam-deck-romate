import {Channels} from 'main/preload'

declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				sendMessage(channel: Channels, args: unknown[]): void
				on(channel: Channels, func: (...args: unknown[]) => void): (() => void) | undefined
				once(channel: Channels, func: (...args: unknown[]) => void): void
			}
			isMac: () => boolean
			isWindows: () => boolean
			isLinux: () => boolean
		}
	}
}

export {}
