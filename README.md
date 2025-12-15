# Weather App Khon Kaen - Next.js Version

แอปพลิเคชันสภาพอากาศสำหรับจังหวัดขอนแก่น ที่สร้างด้วย Next.js 14 และ TypeScript

## ✨ คุณสมบัติ

- 🌤️ แสดงสภาพอากาศปัจจุบันของขอนแก่น
- 🎨 UI/UX ทันสมัยแบบ Minimal Design
- 📱 Responsive Design สำหรับทุกอุปกรณ์
- ⚡ Server-Side Rendering ด้วย Next.js App Router
- 🔄 Auto-refresh ทุก 5 นาที
- 🎯 Interactive Elements และ Animations
- 🌙 Dark Mode Support
- 🔊 Sound Effects และ Haptic Feedback
- 📊 TypeScript สำหรับ Type Safety

## 🚀 การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# รันในโหมด development
npm run dev

# Build สำหรับ production
npm run build

# รันใน production mode
npm start
```

## 🌐 การใช้งาน

เมื่อรันแล้ว แอปจะเปิดที่ `http://localhost:3000`

### API Endpoints

- `GET /api/weather` - ข้อมูลสภาพอากาศขอนแก่น
- `GET /api/status` - สถานะของแอป

## 🏗️ โครงสร้างโปรเจกต์

```
/
├── app/
│   ├── api/
│   │   ├── weather/
│   │   │   └── route.ts
│   │   └── status/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🛠️ เทคโนโลยีที่ใช้

- **Next.js 14** - React Framework with App Router
- **TypeScript** - Type Safety
- **Tailwind CSS** - Utility-first CSS (in globals.css)
- **Open-Meteo API** - Weather Data (Free, No API Key Required)
- **Axios** - HTTP Client
- **React Hooks** - State Management

## 🌤️ ข้อมูลสภาพอากาศ

แอปใช้ข้อมูลจาก Open-Meteo API โดยมีข้อมูล:
- อุณหภูมิปัจจุบัน
- สภาพอากาศ (แปลเป็นภาษาไทย)
- ความชื้น
- ความเร็วลม
- เวลาอัปเดต

## 🎮 Interactive Features

- คลิกอุณหภูมิเพื่อแปลงเป็น Fahrenheit
- คลิกการ์ดข้อมูลเพื่อดูข้อมูลน่าสนใจ
- ปุ่ม refresh พร้อม sound effects
- Haptic feedback สำหรับมือถือ

## 📱 Responsive Design

แอปรองรับการแสดงผลในทุกขนาดหน้าจอ:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🌙 Dark Mode

แอปจะปรับสีตาม system preference อัตโนมัติ

## 📝 การพัฒนาต่อ

สามารถเพิ่มคุณสมบัติเพิ่มเติมได้:
- พยากรณ์อากาศ 7 วัน
- ข้อมูลจังหวัดอื่นๆ
- Charts และ Graphs
- Push Notifications
- PWA Support

---

พัฒนาด้วย ❤️ สำหรับจังหวัดขอนแก่น