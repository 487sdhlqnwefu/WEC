import Seo from "@/components/Seo";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

/** Shown when storeEnabled is false — genuine unavailable, noindex. */
export default function StoreUnavailable() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center wec-section">
      <Seo
        title="Store unavailable | World Espresso Championship"
        description="The World Espresso Championship store is not currently available."
        path="/store"
        noindex
      />
      <div className="wec-card rounded-xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-sand-100 mb-3">Store unavailable</h1>
        <p className="text-sand-400 mb-6">
          No Champion&apos;s Product is for sale at this time. When a product exists under signed
          agreements, WEC will publish status and how to buy it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-cinnamon-600 hover:bg-cinnamon-500 min-h-11">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-sand-400/30 min-h-11">
            <Link to="/panama-2026">WEC 2026</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
