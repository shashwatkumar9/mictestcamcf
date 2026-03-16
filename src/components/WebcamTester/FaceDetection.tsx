'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  dictionary: Dictionary;
}

export function FaceDetection({ videoRef, isActive, dictionary }: FaceDetectionProps) {
  const [faceCount, setFaceCount] = useState(0);
  const [faceBoxes, setFaceBoxes] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const [isSupported, setIsSupported] = useState(false);
  const detectionRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectorRef = useRef<any>(null);

  useEffect(() => {
    // Check if FaceDetector API is supported
    if ('FaceDetector' in window) {
      setIsSupported(true);
      try {
        faceDetectorRef.current = new (window as any).FaceDetector({
          maxDetectedFaces: 10,
          fastMode: true
        });
      } catch (e) {
        console.error('FaceDetector init failed:', e);
        setIsSupported(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive || !isSupported || !videoRef.current || !faceDetectorRef.current) {
      setFaceCount(0);
      setFaceBoxes([]);
      if (detectionRef.current) {
        clearInterval(detectionRef.current);
        detectionRef.current = null;
      }
      return;
    }

    const detectFaces = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      try {
        const faces = await faceDetectorRef.current.detect(videoRef.current);
        setFaceCount(faces.length);

        const boxes = faces.map((face: any) => ({
          x: face.boundingBox.x,
          y: face.boundingBox.y,
          width: face.boundingBox.width,
          height: face.boundingBox.height,
        }));
        setFaceBoxes(boxes);
      } catch (e) {
        // Silent fail
      }
    };

    detectionRef.current = setInterval(detectFaces, 500);

    return () => {
      if (detectionRef.current) {
        clearInterval(detectionRef.current);
      }
    };
  }, [isActive, isSupported, videoRef]);

  if (!isActive || !isSupported || faceCount === 0) {
    return null;
  }

  return (
    <>
      {/* Face Count Badge */}
      <div className="absolute bottom-4 right-4 bg-blue-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>{faceCount} {dictionary.webcam.faceDetection.face}{faceCount !== 1 ? 's' : ''} {dictionary.webcam.faceDetection.facesDetected}</span>
        </div>
      </div>

      {/* Face Bounding Boxes */}
      {faceBoxes.map((box, index) => (
        <div
          key={index}
          className="absolute border-2 border-blue-500 rounded-lg pointer-events-none"
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
            {dictionary.webcam.faceDetection.face} {index + 1}
          </div>
        </div>
      ))}
    </>
  );
}
