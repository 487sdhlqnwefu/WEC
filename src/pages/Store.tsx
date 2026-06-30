import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coffee, Star, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

export default function Store() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.isMock) {
        toast.info("Stripe is not configured yet. Redirecting to demo page...");
      }
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (err) => toast.error(err.message),
  });

  const [cart, setCart] = useState<{ productId: number; name: string; price: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: { id: number; name: string; price: string }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    // For now, checkout the first item. In production, Stripe supports multiple line items.
    const item = cart[0];
    createCheckout.mutate({ productId: item.productId, quantity: item.quantity });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl flex items-start justify-between">
            <div>
              <Coffee className="w-10 h-10 text-gold mb-4" />
              <h1 className="text-4xl sm:text-5xl font-bold text-sand-100 mb-4">
                Champion's Coffee{" "}
                <span className="text-gold">Store</span>
              </h1>
              <p className="text-lg text-sand-400 max-w-2xl">
                Buy past and present champions' coffee products. Every purchase
                supports the champion and the future of transparent coffee
                competition.
              </p>
            </div>
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative w-12 h-12 rounded-xl bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center hover:border-cinnamon-500/50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-sand-300" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cinnamon-600 text-sand-100 text-xs flex items-center justify-center font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Cart Dropdown */}
          {showCart && (
            <div className="absolute right-4 sm:right-auto top-full mt-2 w-full max-w-md bg-[#231a14] border border-[#3a2a1f] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-[#3a2a1f] flex items-center justify-between">
                <h3 className="font-semibold text-sand-100">Your Cart</h3>
                <button onClick={() => setShowCart(false)} className="text-sand-500 hover:text-sand-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {cart.length === 0 ? (
                <div className="p-6 text-center text-sand-500 text-sm">Your cart is empty</div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between p-4 border-b border-[#3a2a1f]/50">
                        <div>
                          <p className="text-sm text-sand-200 font-medium">{item.name}</p>
                          <p className="text-xs text-sand-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gold">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.productId)} className="text-sand-600 hover:text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-[#3a2a1f]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sand-400">Total</span>
                      <span className="text-xl font-bold text-sand-100">€{cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full bg-gold text-[#1a1410] hover:bg-[#d4a35e] font-semibold"
                      onClick={handleCheckout}
                      disabled={createCheckout.isPending}
                    >
                      {createCheckout.isPending ? "Redirecting..." : "Checkout with Stripe"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="wec-card rounded-xl overflow-hidden wec-card-hover flex flex-col"
                >
                  <div className="aspect-square bg-[#2a1f16] relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-16 h-16 text-cinnamon-800" />
                      </div>
                    )}
                    {product.isLimitedEdition && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded bg-gold/90 text-[#1a1410] text-xs font-semibold">
                        Limited Edition
                      </span>
                    )}
                    {product.isSubscription && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded bg-cinnamon-600/90 text-sand-100 text-xs">
                        Subscription
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-sand-100 mb-1">
                      {product.name}
                    </h3>
                    {product.championName && (
                      <p className="text-sm text-gold mb-2">
                        by {product.championName}
                      </p>
                    )}
                    <p className="text-sm text-sand-500 mb-4 flex-1">
                      {product.description}
                    </p>
                    {product.tastingNotes && (
                      <p className="text-xs text-sand-600 mb-3">
                        Notes: {product.tastingNotes}
                      </p>
                    )}
                    {product.royaltyNote && (
                      <p className="text-xs text-cinnamon-400 mb-3 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {product.royaltyNote}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#3a2a1f]/50">
                      <div>
                        <span className="text-xl font-bold text-sand-100">
                          €{product.price}
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm text-sand-600 line-through ml-2">
                            €{product.comparePrice}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100"
                        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
