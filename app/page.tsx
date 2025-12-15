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

  // Update favicon based on weather
  const updateFavicon = (description: string) => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      // Create canvas to draw emoji as favicon
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.font = '24px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(getWeatherIcon(description), 16, 16)
        
        favicon.href = canvas.toDataURL()
      }
    }
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
        updateFavicon(data.description) // Update favicon
        setLastUpdate(new Date().toLocaleString('en-US', {
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
    <div className="app-container">
        <div className="header tech-header">
          <h1 className="title holographic-title">
            <span className="title-glow">Weather</span>
          </h1>
          <p className="location cyber-location">
            📍 Khon Kaen, Thailand
          </p>
        </div>
        
        <div className="weather-main tech-display">
          {loading ? (
            <div className="loading holographic-loading">
              <div className="loading-spinner cyber-spinner"></div>
              <div className="loading-text">
                <span className="scanning-text">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="error cyber-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">Error: {error}</span>
            </div>
          ) : weatherData ? (
            <>
              <div className="weather-display holographic-container"> 
                <span 
                  className={`weather-icon tech-icon ${
                    weatherData.description.includes('ท้องฟ้าแจ่มใส') ? 'sunny' : 
                    weatherData.description.includes('ฝน') ? 'rainy' : ''
                  }`}
                >
                  {getWeatherIcon(weatherData.description)}
                </span>
                <div 
                  className="temperature neon-display" 
                  onClick={() => handleTemperatureClick(weatherData.temperature)}
                >
                  <span className="temp-number digital-font">{Math.round(weatherData.temperature)}</span>
                  <span className="temp-unit digital-font">°C</span>
                </div>
              </div>
              <div className="condition cyber-condition">
                <span className="condition-text hologram-text">{weatherData.description}</span>
              </div>
            </>
          ) : null}
        </div>
        
        {weatherData && !loading && (
          <div className="weather-details tech-grid">
            <div className="detail-card tech-card" onClick={() => handleDetailClick('humidity')}>
              <span className="detail-icon hologram-icon">💧</span>
              <div className="detail-content">
                <div className="detail-label matrix-text">Humidity</div>
                <div className="detail-value neon-value">{weatherData.humidity}<span className="unit">%</span></div>
              </div>
            </div>
            <div className="detail-card tech-card" onClick={() => handleDetailClick('wind')}>
              <span className="detail-icon hologram-icon">💨</span>
              <div className="detail-content">
                <div className="detail-label matrix-text">Wind</div>
                <div className="detail-value neon-value">{weatherData.windspeed}<span className="unit"> km/h</span></div>
              </div>
            </div>
          </div>
        )}
        
        <button 
          className={`refresh-button cyber-button ${
            loading ? 'loading' : ''
          } ${
            weatherData && !loading && !isRefreshing ? 'success' : ''
          }`}
          onClick={loadWeather}
          disabled={loading}
        >
          <span className="refresh-icon cyber-spin">🔄</span>
          <span className="btn-text matrix-font">
            {loading ? 'Loading...' : 'Update'}
          </span>
        </button>
        
        <div className="footer cyber-footer">
          <p className="update-time">
            <span className="time-label">Last updated:</span>
            <span className="time-value neon-text">{lastUpdate || new Date().toLocaleString('en-US', { 
              timeStyle: 'short',
              dateStyle: 'short'
            })}</span>
          </p>
          <div className="system-status">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
      </div>
    )
  }