import { trpc } from "@/providers/trpc";
import { Calendar, ArrowRight, Newspaper, FileText, Megaphone, Coffee } from "lucide-react";
import { Link } from "react-router";

export default function News() {
  const { data: posts, isLoading } = trpc.news.list.useQuery();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "press_release": return FileText;
      case "announcement": return Megaphone;
      case "event_coverage": return Coffee;
      default: return Newspaper;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "press_release": return "Press Release";
      case "announcement": return "Announcement";
      case "event_coverage": return "Event Coverage";
      default: return "Blog";
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <Newspaper className="w-10 h-10 text-cinnamon-400 mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
              News & <span className="wec-gradient-text">Media</span>
            </h1>
            <p className="text-lg text-sand-400 max-w-2xl">
              Press releases, announcements, and stories from the World Espresso
              Championship community.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="grid gap-6">
              {posts?.map((post) => {
                const Icon = getCategoryIcon(post.category ?? "blog");
                return (
                  <article
                    key={post.id}
                    className="wec-card rounded-xl p-6 sm:p-8 wec-card-hover"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 text-xs text-cinnamon-400">
                        <Icon className="w-3 h-3" />
                        {getCategoryLabel(post.category ?? "blog")}
                      </span>
                      <span className="text-xs text-sand-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Recent"}
                      </span>
                      {post.author && (
                        <span className="text-xs text-sand-600">
                          by {post.author}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-sand-100 mb-3">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sand-400 text-sm leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center text-sm text-cinnamon-400 hover:text-cinnamon-300 transition-colors"
                    >
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
