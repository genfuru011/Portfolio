import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html lang="ja">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Hiroto Furugen - Portfolio</title>
				<link rel="stylesheet" href="/tailwind.css" />
				{/* Syntax Highlighting */}
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
				/>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" />
				<script src="https://unpkg.com/htmx.org@2.0.4" />
				<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" />
			</head>
			<body class="min-h-screen py-8" hx-boost="true">
				{children}
				<script
					dangerouslySetInnerHTML={{
						__html: "document.addEventListener('DOMContentLoaded', () => hljs.highlightAll());",
					}}
				/>
			</body>
		</html>
	);
});
