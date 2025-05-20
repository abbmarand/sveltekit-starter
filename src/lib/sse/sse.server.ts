import { randomUUID } from 'crypto';

type Connection = {
	id: string;
	userId: string | null;
	controller: ReadableStreamDefaultController;
};

const connections = new Map<string, Connection>();

/** Called by the route handler when a browser opens `/sse`. */
export function register(
	userId: string | null,
	controller: ReadableStreamDefaultController
) {
	const id = randomUUID();
	connections.set(id, { id, userId, controller });

	// drop the connection when the browser tab closes
	return () => connections.delete(id);
}

/**
 * Push an event to one or many users.
 * @param userIds  Array of user IDs – pass `"all"` to broadcast
 * @param channel  Logical channel name; becomes the `event:` field
 * @param data     Any JSON-serialisable payload
 */
export default function send(
	userIds: string[] | 'all',
	channel: string,
	data: unknown
) {
	const chunk = `event: ${channel}\ndata: ${JSON.stringify(data)}\n\n`;

	for (const c of connections.values()) {
		if (userIds === 'all' || (c.userId && userIds.includes(c.userId))) {
			try {
				c.controller.enqueue(chunk);
			} catch {
				/* connection already closed – ignore */
			}
		}
	}
}
