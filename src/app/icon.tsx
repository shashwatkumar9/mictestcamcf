import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
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
            left: '8px',
            top: '8px',
            width: '8px',
            height: '16px',
            background: '#1e3a5f',
            borderRadius: '2px',
            display: 'flex',
          }}
        />
        {/* Camera/Eye icon (right side) */}
        <div
          style={{
            position: 'absolute',
            right: '8px',
            top: '10px',
            width: '12px',
            height: '12px',
            border: '2px solid #1e3a5f',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '4px',
              background: '#1e3a5f',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
