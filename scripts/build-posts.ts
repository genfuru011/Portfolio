import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");
const OUTPUT_FILE = path.join(process.cwd(), "src/blog/posts.ts");

interface PostMeta {
	slug: string;
	title: string;
	date: string;
	description: string;
}

interface PostData extends PostMeta {
	content: string;
}

function buildPosts() {
	const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
	const posts: PostData[] = [];

	for (const file of files) {
		const slug = file.replace(/\.md$/, "");
		const filePath = path.join(CONTENT_DIR, file);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const { data, content } = matter(fileContent);

		const dateValue =
			data.date instanceof Date
				? data.date.toISOString().split("T")[0]
				: String(data.date || new Date().toISOString().split("T")[0]);

		posts.push({
			slug,
			title: data.title || slug,
			date: dateValue,
			description: data.description || "",
			content: content.trim(),
		});
	}

	// Sort by date descending
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const output = `// This file is auto-generated. Do not edit manually.
// Run: npm run build:posts

import { marked } from "marked";

export interface Post {
	slug: string;
	title: string;
	date: string;
	description: string;
	content: string;
}

type PostMeta = Omit<Post, "content">;

const postsData: PostMeta[] = ${JSON.stringify(
		posts.map(({ slug, title, date, description }) => ({
			slug,
			title,
			date,
			description,
		})),
		null,
		"\t",
	)};

const markdownContents: Record<string, string> = {
${posts.map((p) => `\t"${p.slug}": ${JSON.stringify(p.content)}`).join(",\n")},
};

export function getAllPosts(): PostMeta[] {
	return postsData;
}

export function getPostBySlug(slug: string): Post | null {
	const postMeta = postsData.find((p) => p.slug === slug);
	if (!postMeta) return null;

	const markdown = markdownContents[slug];
	if (!markdown) return null;

	return {
		...postMeta,
		content: marked(markdown) as string,
	};
}
`;

	fs.writeFileSync(OUTPUT_FILE, output);
	console.log(`Generated ${OUTPUT_FILE} with ${posts.length} posts`);
}

buildPosts();
