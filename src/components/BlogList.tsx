import { getAllPosts } from "../blog/posts";

export const BlogList = () => {
	const posts = getAllPosts();
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
					<h1 class="text-4xl font-normal text-gray-900">Blog</h1>
				</header>
				<main>
					<div class="space-y-8">
						{posts.map((post) => (
							<article key={post.slug} class="border-b border-gray-100 pb-8">
								<a href={`/blog/${post.slug}`} class="block group">
									<h2 class="text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
										{post.title}
									</h2>
									<p class="text-gray-500 text-sm mt-2">{post.date}</p>
									<p class="text-gray-600 mt-3">{post.description}</p>
								</a>
							</article>
						))}
					</div>
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
