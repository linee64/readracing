import { Metadata } from 'next';
import { Suspense } from 'react';
import ShareContent from './ShareContent';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const rank = searchParams.rank || '0';
  const pages = searchParams.pages || '0';
  const name = searchParams.name || 'Reader';
  
  // Construct absolute URL for OG image
  // In production, this should be the deployed URL
  // We'll rely on relative path /api/og which Next.js resolves against metadataBase if set,
  // or we can try to be clever. For now, let's use a relative path which usually works if the host is correct.
  // However, for social cards, absolute URLs are safer.
  
  return {
    title: `I read ${pages} pages on ReadRacing!`,
    description: `I am ranked #${rank} on ReadRacing. Join me and turn reading into a habit.`,
    openGraph: {
      title: `I read ${pages} pages on ReadRacing!`,
      description: `I am ranked #${rank} on ReadRacing. Join me and turn reading into a habit.`,
      images: [`/api/og?rank=${rank}&pages=${pages}&name=${name}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `I read ${pages} pages on ReadRacing!`,
      description: `I am ranked #${rank} on ReadRacing. Join me and turn reading into a habit.`,
      images: [`/api/og?rank=${rank}&pages=${pages}&name=${name}`],
    },
  };
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9f5e9]" />}>
      <ShareContent />
    </Suspense>
  );
}
