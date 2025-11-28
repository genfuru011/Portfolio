import type { Post } from "../blog/posts";

export const BlogPost = ({ post }: { post: Post }) => {
	return (
		<div class="min-h-screen bg-white">
			<div class="max-w-4xl mx-auto px-6 py-16">
				<header class="mb-12">
					<a
						href="/blog"
						class="text-gray-500 hover:text-gray-900 transition-colors"
					>
						&larr; Back to Blog
					</a>
					<h1 class="text-4xl font-normal text-gray-900 mt-4">{post.title}</h1>
					<p class="text-gray-500 mt-2">{post.date}</p>
				</header>
				<main class="prose prose-gray max-w-none">
					<div dangerouslySetInnerHTML={{ __html: post.content }} />
				</main>
			</div>
		</div>
	);
};
