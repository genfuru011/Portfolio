import type { Post } from "../blog/posts";

export const BlogPost = ({ post }: { post: Post }) => {
	return (
		<div class="min-h-screen bg-white">
			<div class="max-w-4xl mx-auto px-6 py-16">
				<header class="mb-12">
					<div class="flex items-center justify-between mb-8">
						<a href="/" class="text-2xl font-medium text-gray-900">
							Hiroto Furugen
						</a>
						<nav class="flex items-center gap-6">
							<a
								href="/about"
								class="text-gray-600 hover:text-gray-900 transition-colors"
							>
								About
							</a>
						</nav>
					</div>
					<a
						href="/"
						class="text-gray-500 hover:text-gray-900 transition-colors text-sm"
					>
						&larr; Back to Home
					</a>
					<h1 class="text-4xl font-normal text-gray-900 mt-4">{post.title}</h1>
					<p class="text-gray-500 mt-2">{post.date}</p>
				</header>
				<main class="prose prose-gray max-w-none">
					<div dangerouslySetInnerHTML={{ __html: post.content }} />
				</main>

				{/* Footer */}
				<footer class="mt-16 pt-8 border-t border-gray-200">
					<p class="text-center text-sm text-gray-500">
						© 2025 Hiroto Furugen. Built with{" "}
						<a
							href="https://hono.dev"
							class="text-gray-600 hover:text-gray-900 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Hono
						</a>{" "}
						&{" "}
						<a
							href="https://workers.cloudflare.com"
							class="text-gray-600 hover:text-gray-900 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Cloudflare Workers
						</a>
					</p>
				</footer>
			</div>
		</div>
	);
};
