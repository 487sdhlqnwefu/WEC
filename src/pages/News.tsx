import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { STATIC_NEWS } from "@/data/staticContent";
import Seo from "@/components/Seo";
import { Calendar, Newspaper, FileText, Megaphone, Coffee } from "lucide-react";

export default function News() {
  const { data: posts } = trpc.news.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const list = [...(posts && posts.length > 0 ? posts : STATIC_NEWS)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "press_release":
        return FileText;
      case "announcement":
        return Megaphone;
      case "event_coverage":
        return Coffee;
      default:
        return Newspaper;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "press_release":
        return "Press Release";
      case "announcement":
        return "Announcement";
      case "event_coverage":
        return "Event Coverage";
      default:
        return "Blog";
    }
  };

  return (
    <div>
      <Seo
        title="News & Media | World Espresso Championship"
        description="Press releases and announcements from the World Espresso Championship."
        path="/news"
      />
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <Newspaper className="w-10 h-10 text-cinnamon-400 mb-4" aria-hidden />
            <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
              News & <span className="wec-gradient-text">Media</span>
            </h1>
            <p className="text-lg text-sand-400 max-w-2xl">
              Press releases, announcements, and stories from the World Espresso Championship.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid gap-6">
            {list.map((post) => {
              const Icon = getCategoryIcon(post.category ?? "blog");
              return (
                <article key={post.id} className="wec-card rounded-xl p-6 sm:p-8 wec-card-hover">
                  <Link to={`/news/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnamon-500 rounded-lg">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 text-xs text-cinnamon-400">
                        <Icon className="w-3 h-3" aria-hidden />
                        {getCategoryLabel(post.category ?? "blog")}
                      </span>
                      <span className="text-xs text-sand-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" aria-hidden />
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-sand-100 mb-3">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-sand-400 leading-relaxed">{post.excerpt}</p>
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
