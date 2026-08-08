import { BUSINESS } from '@/constants/business';

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/collections/sunglasses". */
  path: string;
  image?: string;
}

const ORIGIN = 'https://bajajoptics.in';

/**
 * Per-route metadata. React 19 hoists <title>/<meta>/<link> rendered here into
 * <head> automatically — no helmet dependency needed.
 */
export function Seo({ title, description, path, image }: SeoProps) {
  const url = `${ORIGIN}${path}`;
  const fullTitle = `${title} — ${BUSINESS.name}`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
