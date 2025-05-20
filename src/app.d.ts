// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { WebSocket } from 'ws';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: typeof users.$inferSelect;
			auth: ReturnType<typeof import('./auth').auth>;
			session?: {
				user?: {
					email?: string | null;
					name?: string | null;
				} | null;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		// interface Platform {}
	}
}

export {};
