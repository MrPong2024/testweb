import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    // พิกัดขอนแก่น: ละติจูด 16.4322, ลองจิจูด 102.8236
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=16.4322&longitude=102.8236&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=Asia%2FBangkok'
    )
    
    const weatherData = response.data
    const current = weatherData.current_weather
    
    // แปลงรหัสสภาพอากาศเป็นภาษาไทย
    const getWeatherDescription = (code: number): string => {
      const weatherCodes: Record<number, string> = {
        0: 'ท้องฟ้าแจ่มใส',
        1: 'เมฆบางส่วน',
        2: 'เมฆมาก',
        3: 'เมฆครึ้ม',
        45: 'หมอก',
        48: 'หมอกแข็ง',
        51: 'ฝนปรอยๆ เบา',
        53: 'ฝนปรอยๆ ปานกลาง',
        55: 'ฝนปรอยๆ หนัก',
        61: 'ฝนเบา',
        63: 'ฝนปานกลาง',
        65: 'ฝนหนัก',
        80: 'ฝนฟ้าคะนอง เบา',
        81: 'ฝนฟ้าคะนอง ปานกลาง',
        82: 'ฝนฟ้าคะนอง หนัก',
        95: 'พายุฟ้าร้อง',
        96: 'พายุฟ้าร้องพร้อมลูกเห็บ เบา',
        99: 'พายุฟ้าร้องพร้อมลูกเห็บ หนัก'
      }
      return weatherCodes[code] || 'ไม่ทราบสภาพอากาศ'
    }
    
    const weatherInfo = {
      location: 'ขอนแก่น, ประเทศไทย',
      temperature: current.temperature,
      windspeed: current.windspeed,
      description: getWeatherDescription(current.weathercode),
      time: current.time,
      humidity: weatherData.hourly.relative_humidity_2m[0] || 'N/A'
    }
    
    return NextResponse.json(weatherInfo)
    
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถดึงข้อมูลสภาพอากาศได้' },
      { status: 500 }
    )
  }
}