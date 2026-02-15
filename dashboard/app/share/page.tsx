import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const params = await searchParams;
  const rank = params.rank || '0';
  const pages = params.pages || '0';
 
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'https://readracing.vercel.app';

  const imageUrl = `${baseUrl}/api/og?rank=${rank}&pages=${pages}`;
 
  return {
    title: `I reached Rank #${rank} on ReadRacing!`,
    description: `I have read ${pages} pages. Join me on ReadRacing and track your reading progress!`,
    openGraph: {
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      images: [imageUrl],
    },
  };
}
 
export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const rank = params.rank || '0';
  const pages = params.pages || '0';
  const imageUrl = `/api/og?rank=${rank}&pages=${pages}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EFE6] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-[#3D2817]">
        <div className="p-6 text-center">
            <h1 className="text-2xl font-serif font-bold text-[#3D2817] mb-2">
                ReadRacing Progress
            </h1>
            <p className="text-[#8B7E6A] mb-6">
                Rank #{rank} • {pages} Pages Read
            </p>
            
            <div className="relative aspect-[1.91/1] w-full mb-6 rounded-lg overflow-hidden border border-[#E5DCC8]">
                <img 
                    src={imageUrl} 
                    alt="Progress Share" 
                    className="w-full h-full object-cover"
                />
            </div>

            <Link 
                href="/"
                className="block w-full bg-[#3D2817] text-[#F5EFE6] py-3 rounded-xl font-medium hover:bg-[#2A1B10] transition-colors"
            >
                Join the Race
            </Link>
        </div>
      </div>
    </div>
  );
}
