'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  location: string
  temperature: number
  windspeed: number
  description: string
  time: string
  humidity: number | string
}

interface WeatherIconMap {
  [key: string]: string
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Weather icon mapping
  const getWeatherIcon = (description: string): string => {
    const icons: WeatherIconMap = {
      'ท้องฟ้าแจ่มใส': '☀️',
      'เมฆบางส่วน': '⛅',
      'เมฆมาก': '☁️',
      'เมฆครึ้ม': '🌫️',
      'หมอก': '🌫️',
      'ฝนเบา': '🌦️',
      'ฝนปานกลาง': '🌧️',
      'ฝนหนัก': '⛈️',
      'ฝนฟ้าคะนอง': '⛈️',
      'พายุฟ้าร้อง': '🌩️'
    }
    return icons[description] || '🌤️'
  }

  // Play refresh sound
  const playRefreshSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('Audio not supported')
    }
  }

  // Haptic feedback
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  // Load weather data
  const loadWeather = async () => {
    setLoading(true)
    setIsRefreshing(true)
    setError(null)
    
    playRefreshSound()
    vibrate()

    try {
      const response = await fetch('/api/weather')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      // Add delay for smooth animation
      setTimeout(() => {
        setWeatherData(data)
        setLastUpdate(new Date().toLocaleString('th-TH', {
          timeStyle: 'short',
          dateStyle: 'short'
        }))
        setLoading(false)
        setIsRefreshing(false)
      }, 800)
      
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      setLoading(false)
      setIsRefreshing(false)
      console.error('Error:', error)
    }
  }

  // Temperature converter
  const handleTemperatureClick = (temp: number) => {
    vibrate()
    const fahrenheit = Math.round((temp * 9/5) + 32)
    
    // Show temp in Fahrenheit temporarily
    const tempElement = document.querySelector('.temperature')
    if (tempElement) {
      const originalText = tempElement.textContent
      tempElement.textContent = `${fahrenheit}°F`
      tempElement.classList.add('temp-clicked')
      
      setTimeout(() => {
        tempElement.textContent = originalText
        tempElement.classList.remove('temp-clicked')
      }, 2000)
    }
  }

  // Detail card interactions
  const handleDetailClick = (type: string) => {
    vibrate()
    
    const facts: { [key: string]: string } = {
      humidity: 'ความชื้นสูงทำให้รู้สึกร้อนมากขึ้น! 🌡️',
      wind: 'ลมช่วยระบายอากาศและทำให้รู้สึกเย็นลง! 🍃'
    }
    
    // Show fact popup
    const factElement = document.createElement('div')
    factElement.className = 'fact-popup'
    factElement.textContent = facts[type]
    
    factElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 16px;
      z-index: 1000;
      animation: fadeInOut 3s ease-in-out;
      text-align: center;
      max-width: 80%;
    `
    
    document.body.appendChild(factElement)
    
    setTimeout(() => {
      document.body.removeChild(factElement)
    }, 3000)
  }

  // Load weather on mount
  useEffect(() => {
    loadWeather()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadWeather, 300000)
    return () => clearInterval(interval)
  }, [])

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
      .temp-clicked {
        transform: scale(1.1) rotate(5deg) !important;
        color: #3b82f6 !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      {/* Background particles */}
      <div className="background-elements">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div className="app-container">
        <div className="header">
          <h1 className="title">สภาพอากาศ</h1>
          <p className="location">📍 ขอนแก่น, ประเทศไทย</p>
        </div>
        
        <div className="weather-main">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span>กำลังโหลด...</span>
            </div>
          ) : error ? (
            <div className="error">❌ {error}</div>
          ) : weatherData ? (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px' 
              }}>
                <span 
                  className={`weather-icon ${
                    weatherData.description.includes('ท้องฟ้าแจ่มใส') ? 'sunny' : 
                    weatherData.description.includes('ฝน') ? 'rainy' : ''
                  }`}
                >
                  {getWeatherIcon(weatherData.description)}
                </span>
                <div 
                  className="temperature" 
                  onClick={() => handleTemperatureClick(weatherData.temperature)}
                >
                  {Math.round(weatherData.temperature)}°
                </div>
              </div>
              <div className="condition">{weatherData.description}</div>
            </>
          ) : null}
        </div>
        
        {weatherData && !loading && (
          <div className="weather-details">
            <div className="detail-card" onClick={() => handleDetailClick('humidity')}>
              <span className="detail-icon">💧</span>
              <div className="detail-label">ความชื้น</div>
              <div className="detail-value">{weatherData.humidity}%</div>
            </div>
            <div className="detail-card" onClick={() => handleDetailClick('wind')}>
              <span className="detail-icon">💨</span>
              <div className="detail-label">ลม</div>
              <div className="detail-value">{weatherData.windspeed} กม/ชม</div>
            </div>
          </div>
        )}
        
        <button 
          className={`refresh-button ${loading ? 'loading' : ''} ${
            weatherData && !loading && !isRefreshing ? 'success' : ''
          }`}
          onClick={loadWeather}
          disabled={loading}
        >
          <span className="refresh-icon">🔄</span>
          <span>อัปเดต</span>
        </button>
        
        <div className="footer">
          <p>อัปเดตล่าสุด: {lastUpdate || new Date().toLocaleString('th-TH')}</p>
        </div>
      </div>
    </>
  )
}