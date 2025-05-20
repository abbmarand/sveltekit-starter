// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { eq } from 'drizzle-orm';

import { users } from '$lib/server/db/schema';

import { handle as AuthHandle } from './auth';
import { db } from '$lib/server/db';

const authorizationHandle: Handle = async ({ event, resolve }) => {
	const auth = await event.locals.auth();

	// Handle protected routes
	//if (event.url.pathname.startsWith('/api') || event.url.pathname.startsWith('/dashboard')) {
	if (!auth?.user?.email) {
		redirect(302, '/signin');
	}

	const user = await db.query.users.findFirst({
		where: eq(users.email, auth.user.email)
	});

	if (!user) {
		redirect(302, '/signin');
	}

	event.locals.user = user;
	event.locals.session = auth;
	//}

	return resolve(event);
};

export const handle: Handle = sequence(AuthHandle, authorizationHandle);

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('❌  Server error for', event.url, '\n', error);
	// Return a safe payload – it becomes $page.error in +error.svelte
	return { message: 'Unexpected server error' };
};
