import type { RequestHandler } from '@sveltejs/kit';

import send from '@/sse/sse.server';
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	send([user?.id], 'pong', { message: 'pong' });
	return new Response('pong');
};
