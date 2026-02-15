import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
 
    // ?rank=...&pages=...
    const hasRank = searchParams.has('rank');
    const rank = hasRank ? searchParams.get('rank')?.slice(0, 10) : '0';
    const pages = searchParams.get('pages')?.slice(0, 10) || '0';
    const name = searchParams.get('name')?.slice(0, 20) || 'Reader';

    // Fetch font
    let fontData: ArrayBuffer | null = null;
    try {
      const response = await fetch(
        new URL('https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBk18UPW-K.woff')
      );
      if (response.ok) {
        fontData = await response.arrayBuffer();
      }
    } catch (e) {
      console.error('Failed to fetch font:', e);
    }
 
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5EFE6', // brand-beige
            fontFamily: fontData ? '"Lora"' : 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #3D2817', // brand-brown
              borderRadius: '20px',
              padding: '40px 60px',
              backgroundColor: 'white',
              boxShadow: '10px 10px 0px #3D2817',
            }}
          >
            <div
              style={{
                fontSize: 30,
                color: '#8B7E6A', // brand-text-light
                marginBottom: 20,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 'bold',
              }}
            >
              ReadRacing Leaderboard
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 80, fontWeight: 'bold', color: '#3D2817', lineHeight: 1 }}>
                RANK #{rank}
              </div>
              <div style={{ fontSize: 40, color: '#3D2817', marginTop: 10 }}>
                {pages} Pages Read
              </div>
              {name !== 'Reader' && (
                <div style={{ fontSize: 30, color: '#8B7E6A', marginTop: 10 }}>
                  Reader: {name}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 40,
                fontSize: 24,
                color: '#8B7E6A',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#E65100', // orange dot
                  borderRadius: '50%',
                  marginRight: 10,
                }}
              />
              readracing.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData ? [
          {
            name: 'Lora',
            data: fontData,
            style: 'normal',
          },
        ] : undefined,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
