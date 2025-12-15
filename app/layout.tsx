import { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🌤️ สภาพอากาศขอนแก่น',
  description: 'แอปพลิเคชันสภาพอากาศสำหรับจังหวัดขอนแก่น พร้อมข้อมูลอุณหภูมิ ความชื้น และความเร็วลม',
  keywords: ['สภาพอากาศ', 'ขอนแก่น', 'อุณหภูมิ', 'ความชื้น', 'ลม'],
  authors: [{ name: 'Weather App Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}