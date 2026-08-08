import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader } from '@/components/layout/Loader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingDock } from '@/components/layout/FloatingDock';
import { ScrollManager } from '@/components/util/ScrollManager';
import { HomePage } from '@/pages/HomePage';
import { useLenis } from '@/hooks/useLenis';

// Collection routes are code-split so the homepage bundle stays lean.
const CollectionPage = lazy(() =>
  import('@/pages/CollectionPage').then((m) => ({ default: m.CollectionPage }))
);
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const WishlistPage = lazy(() =>
  import('@/pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);

function RouteFallback() {
  return (
    <div className="min-h-screen bg-matte flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-mist-bright animate-spin" />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <ScrollManager />
      <Navbar />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections/:category" element={<CollectionPage />} />
          <Route path="/collections/:category/:slug" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </Suspense>

      <Footer />
      <FloatingDock />
    </>
  );
}
