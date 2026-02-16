import { ImageResponse } from 'next/og';

// export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    console.log('OG Route hit:', request.url);
    const { searchParams } = new URL(request.url);

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
            backgroundColor: '#F5EFE6',
            fontFamily: fontData ? '"Lora"' : 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #3D2817',
              borderRadius: '20px',
              padding: '40px 60px',
              backgroundColor: '#f9f5e9',
              boxShadow: '10px 10px 0px #3d1c0b',
              width: '80%',
              height: '80%',
            }}
          >
            {/* Decorative Corners */}
            <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '4px solid #e9c46a', borderLeft: '4px solid #e9c46a', display: 'flex' }} />
            <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '4px solid #e9c46a', borderRight: '4px solid #e9c46a', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '4px solid #e9c46a', borderLeft: '4px solid #e9c46a', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '4px solid #e9c46a', borderRight: '4px solid #e9c46a', display: 'flex' }} />

            <div
              style={{
                display: 'flex',
                fontSize: 40,
                color: '#8B7E6A',
                marginBottom: 20,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              ReadRacing Leaderboard
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  backgroundColor: '#e9c46a',
                  marginBottom: 10,
                  boxShadow: '0 15px 35px rgba(61, 28, 11, 0.4)',
                  border: '4px solid white',
                }}
              >
                <div style={{ display: 'flex', fontSize: 90, fontWeight: 'bold', color: '#3d1c0b', lineHeight: 1 }}>
                  #{rank}
                </div>
              </div>

              <div style={{ display: 'flex', fontSize: 50, color: '#3d1c0b', marginTop: 10 }}>
                {pages} Pages
              </div>
              {name !== 'Reader' && (
                <div style={{ display: 'flex', fontSize: 30, color: '#8B7E6A', marginTop: 20 }}>
                  Reader: {name}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData
          ? [
              {
                name: 'Lora',
                data: fontData,
                style: 'normal',
              },
            ]
          : undefined,
      }
    );
  } catch (e: any) {
    console.error('OG Image Generation Error:', e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
