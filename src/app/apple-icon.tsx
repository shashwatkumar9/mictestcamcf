import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Microphone icon (left side) */}
        <div
          style={{
            position: 'absolute',
            left: '30px',
            top: '45px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Mic body */}
          <div
            style={{
              width: '15px',
              height: '80px',
              background: '#1e3a5f',
              borderRadius: '8px',
              display: 'flex',
            }}
          />
          {/* Sound waves */}
          <div
            style={{
              position: 'absolute',
              right: '-25px',
              top: '20px',
              width: '20px',
              height: '3px',
              background: '#1e3a5f',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-30px',
              top: '35px',
              width: '25px',
              height: '3px',
              background: '#1e3a5f',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Camera/Eye icon (right side) */}
        <div
          style={{
            position: 'absolute',
            right: '30px',
            top: '45px',
            width: '70px',
            height: '70px',
            border: '8px solid #1e3a5f',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
          }}
        >
          {/* Inner white circle */}
          <div
            style={{
              width: '45px',
              height: '45px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Pupil */}
            <div
              style={{
                width: '20px',
                height: '20px',
                background: '#1e3a5f',
                borderRadius: '50%',
                position: 'relative',
              }}
            >
              {/* Light reflection */}
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '6px',
                  height: '6px',
                  background: 'white',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
