import { getAllPosts } from "../blog/posts";

export const BlogList = () => {
	const posts = getAllPosts();
	return (
		<div class="min-h-screen bg-white">
			<div class="max-w-4xl mx-auto px-6 py-16">
				<header class="mb-12">
					<a
						href="/"
						class="text-gray-500 hover:text-gray-900 transition-colors"
					>
						&larr; Back to Home
					</a>
					<h1 class="text-4xl font-normal text-gray-900 mt-4">Blog</h1>
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
			</div>
		</div>
	);
};
