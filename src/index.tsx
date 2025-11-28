import { Hono } from "hono";
import { renderer } from "./renderer";
import { getPostBySlug } from "./blog/posts";
import { Home } from "./components/Home";
import { App } from "./components/App";
import { BlogPost } from "./components/BlogPost";

type CloudflareBindings = {
	ASSETS: {
		fetch: (request: Request) => Promise<Response>;
	};
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(renderer);

// Static assets
app.get("/favicon.ico", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/favicon-*.png", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/apple-touch-icon.png", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/images/*", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/tailwind.css", (c) => c.env.ASSETS.fetch(c.req.raw));

// Routes
app.get("/", (c) => c.render(<Home />));
app.get("/about", (c) => c.render(<App />));
app.get("/blog/:slug", (c) => {
	const slug = c.req.param("slug");
	const post = getPostBySlug(slug);
	if (!post) return c.notFound();
	return c.render(<BlogPost post={post} />);
});

export default app;
