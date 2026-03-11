/**
 * BETTER AUTH HANDLER - Direct Next.js integration
 *
 * This file exports Better Auth handlers for Next.js route segments.
 * The handler function is wrapped to work with Next.js App Router.
 */

import { auth } from '@adagio/auth/server';

/**
 * Convert Better Auth handler to Next.js App Router format
 *
 * Better Auth's handler is a single function that handles all HTTP methods.
 * Next.js App Router expects separate named exports (GET, POST, etc.).
 */
function toNextJsHandler(authInstance: { handler: (request: Request) => Promise<Response> }) {
	const handler = async (request: Request) => {
		return authInstance.handler(request);
	};

	return {
		GET: handler,
		POST: handler,
		PATCH: handler,
		PUT: handler,
		DELETE: handler,
	};
}

/**
 * Better Auth handlers for Next.js
 * Export all HTTP method handlers for the catch-all route
 */
export const { GET, POST, PUT, PATCH, DELETE } = toNextJsHandler(auth);
