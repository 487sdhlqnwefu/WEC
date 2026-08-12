import { Link, useParams } from "react-router";
import Seo from "@/components/Seo";
import { STATIC_NEWS } from "@/data/staticContent";
import { SITE_URL } from "@/data/wecFacts";
import NotFound from "./NotFound";

export default function NewsArticle() {
  const { slug } = useParams();
  const post = STATIC_NEWS.find((p) => p.slug === slug && p.published);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div>
      <Seo
        title={`${post.title} | World Espresso Championship`}
        description={post.excerpt || post.title}
        path={`/news/${post.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.createdAt.toISOString(),
          author: { "@type": "Organization", name: "World Espresso Championship" },
          mainEntityOfPage: `${SITE_URL}/news/${post.slug}`,
        }}
      />
      <article className="wec-section">
        <div className="wec-container max-w-3xl">
          <p className="text-sm text-cinnamon-400 mb-3">
            {post.createdAt.toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {post.category ? ` · ${post.category.replace("_", " ")}` : ""}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-6">{post.title}</h1>
          {post.excerpt && (
            <p className="text-lg text-sand-400 mb-8 leading-relaxed">{post.excerpt}</p>
          )}
          <div className="text-sand-400 leading-relaxed whitespace-pre-wrap">{post.content}</div>
          <p className="mt-10">
            <Link to="/news" className="text-cinnamon-400 hover:text-cinnamon-300 text-sm">
              ← All news
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}
