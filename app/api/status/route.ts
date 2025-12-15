import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    message: 'Weather App สำหรับขอนแก่น 🌤️',
    version: '2.0.0',
    framework: 'Next.js',
    features: ['Server-side Rendering', 'API Routes', 'TypeScript', 'App Router']
  })
}