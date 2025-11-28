import { getAllPosts } from "../blog/posts";

export const Home = () => {
	const posts = getAllPosts();

	return (
		<div class="min-h-screen bg-white">
			<div class="max-w-4xl mx-auto px-6 py-16">
				{/* Header */}
				<header class="mb-16">
					<div class="flex items-center justify-between mb-12">
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
							<a
								href="https://github.com/genfuru011"
								class="text-gray-500 hover:text-gray-900 transition-colors"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<title>GitHub</title>
									<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.373-12-12-12z" />
								</svg>
							</a>
							<a
								href="https://x.com/Elmarit_28"
								class="text-gray-500 hover:text-gray-900 transition-colors"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<title>X</title>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
						</nav>
					</div>

					{/* Hero */}
					<div class="mb-16">
						<h1 class="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
							Hi, I'm Hiroto
						</h1>
						<p class="text-xl text-gray-600 max-w-2xl">
							Engineer Intern at LayerX based in Tokyo.
							<br />I build applications and web services.
						</p>
					</div>
				</header>

				{/* Latest Posts */}
				<main>
					<h2 class="text-2xl font-normal text-gray-900 mb-8">Latest Posts</h2>
					<div class="grid gap-8 md:grid-cols-2">
						{posts.map((post) => (
							<article key={post.slug} class="group">
								<a href={`/blog/${post.slug}`} class="block">
									{/* Thumbnail */}
									<div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
										{post.thumbnail ? (
											<img
												src={post.thumbnail}
												alt={post.title}
												class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										) : (
											<div class="w-full h-full flex items-center justify-center text-gray-400">
												<svg
													class="w-12 h-12"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="1.5"
														d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
													/>
												</svg>
											</div>
										)}
									</div>
									{/* Content */}
									<p class="text-sm text-gray-500 mb-2">{post.date}</p>
									<h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
										{post.title}
									</h3>
									<p class="text-gray-600 text-sm line-clamp-2">
										{post.description}
									</p>
								</a>
							</article>
						))}
					</div>
				</main>
			</div>
		</div>
	);
};
