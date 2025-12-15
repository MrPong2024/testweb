const express = require('express')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>🌤️ สภาพอากาศขอนแก่น</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #2c3e50;
            line-height: 1.6;
          }
          
          .app-container {
            max-width: 400px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.1),
              0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
          }
          
          .app-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
          }
          
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .title {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 4px;
            letter-spacing: -0.02em;
          }
          
          .location {
            font-size: 14px;
            color: #64748b;
            font-weight: 400;
          }
          
          .weather-main {
            text-align: center;
            margin-bottom: 32px;
            padding: 24px 0;
          }
          
          .temperature {
            font-size: 64px;
            font-weight: 300;
            color: #1e293b;
            line-height: 1;
            margin-bottom: 8px;
            letter-spacing: -0.04em;
          }
          
          .condition {
            font-size: 16px;
            color: #64748b;
            font-weight: 400;
            margin-bottom: 16px;
          }
          
          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #64748b;
            font-size: 14px;
          }
          
          .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e2e8f0;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .weather-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .detail-card {
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
          }
          
          .detail-card:hover {
            background: #f1f5f9;
            transform: translateY(-2px);
          }
          
          .detail-icon {
            font-size: 20px;
            margin-bottom: 8px;
            display: block;
          }
          
          .detail-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }
          
          .detail-value {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .refresh-button {
            width: 100%;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 20px;
          }
          
          .refresh-button:hover {
            background: #2563eb;
            transform: translateY(-1px);
          }
          
          .refresh-button:active {
            transform: translateY(0);
          }
          
          .footer {
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
          }
          
          .error {
            background: #fee2e2;
            color: #dc2626;
            padding: 20px;
            border-radius: 16px;
            text-align: center;
            font-size: 14px;
            border: 1px solid #fecaca;
          }
          
          /* Responsive design */
          @media (max-width: 480px) {
            .app-container {
              padding: 24px;
              margin: 16px;
            }
            
            .temperature {
              font-size: 56px;
            }
            
            .weather-details {
              gap: 12px;
            }
            
            .detail-card {
              padding: 16px;
            }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            body {
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            }
            
            .app-container {
              background: rgba(30, 41, 59, 0.95);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .title {
              color: #f1f5f9;
            }
            
            .location, .condition {
              color: #94a3b8;
            }
            
            .temperature {
              color: #f8fafc;
            }
            
            .detail-card {
              background: #334155;
              border: 1px solid #475569;
            }
            
            .detail-card:hover {
              background: #3f4b5b;
            }
            
            .detail-value {
              color: #f1f5f9;
            }
            
            .error {
              background: rgba(220, 38, 38, 0.1);
              border: 1px solid rgba(220, 38, 38, 0.3);
            }
          }
        </style>
      </head>
      <body>
        <div class="app-container">
          <div class="header">
            <h1 class="title">สภาพอากาศ</h1>
            <p class="location">📍 ขอนแก่น, ประเทศไทย</p>
          </div>
          
          <div class="weather-main">
            <div id="weather-content">
              <div class="loading">
                <div class="loading-spinner"></div>
                <span>กำลังโหลด...</span>
              </div>
            </div>
          </div>
          
          <div id="weather-details" class="weather-details" style="display: none;">
            <!-- Weather details will be populated here -->
          </div>
          
          <button class="refresh-button" onclick="loadWeather()">
            <span>🔄</span>
            <span>อัปเดต</span>
          </button>
          
          <div class="footer">
            <p>อัปเดตล่าสุด: <span id="last-update">${new Date().toLocaleString('th-TH')}</span></p>
          </div>
        </div>

        <script>
          async function loadWeather() {
            const content = document.getElementById('weather-content');
            const details = document.getElementById('weather-details');
            const updateTime = document.getElementById('last-update');
            
            content.innerHTML = \`
              <div class="loading">
                <div class="loading-spinner"></div>
                <span>กำลังโหลด...</span>
              </div>
            \`;
            details.style.display = 'none';
            
            try {
              const response = await fetch('/api/weather');
              const data = await response.json();
              
              if (data.error) {
                content.innerHTML = \`<div class="error">❌ \${data.error}</div>\`;
                return;
              }
              
              // Main weather display
              content.innerHTML = \`
                <div class="temperature">\${Math.round(data.temperature)}°</div>
                <div class="condition">\${data.description}</div>
              \`;
              
              // Weather details
              details.innerHTML = \`
                <div class="detail-card">
                  <span class="detail-icon">💧</span>
                  <div class="detail-label">ความชื้น</div>
                  <div class="detail-value">\${data.humidity}%</div>
                </div>
                <div class="detail-card">
                  <span class="detail-icon">💨</span>
                  <div class="detail-label">ลม</div>
                  <div class="detail-value">\${data.windspeed} กม/ชม</div>
                </div>
              \`;
              details.style.display = 'grid';
              
              updateTime.textContent = new Date().toLocaleString('th-TH', {
                timeStyle: 'short',
                dateStyle: 'short'
              });
              
            } catch (error) {
              content.innerHTML = \`
                <div class="error">
                  ❌ เกิดข้อผิดพลาดในการโหลดข้อมูล
                </div>
              \`;
              console.error('Error:', error);
            }
          }
          
          // Load weather data when page loads
          window.addEventListener('load', loadWeather);
          
          // Auto-refresh every 5 minutes
          setInterval(loadWeather, 300000);
          
          // Add some nice interactions
          document.addEventListener('DOMContentLoaded', function() {
            // Add smooth scroll behavior
            document.documentElement.style.scrollBehavior = 'smooth';
          });
        </script>
      </body>
    </html>
  `)
})

// API endpoint สำหรับดึงข้อมูลสภาพอากาศขอนแก่น
app.get('/api/weather', async (req, res) => {
  try {
    // พิกัดขอนแก่น: ละติจูด 16.4322, ลองจิจูด 102.8236
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=16.4322&longitude=102.8236&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=Asia%2FBangkok'
    )
    
    const weatherData = response.data
    const current = weatherData.current_weather
    
    // แปลงรหัสสภาพอากาศเป็นภาษาไทย
    const getWeatherDescription = (code) => {
      const weatherCodes = {
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
    
    res.json(weatherInfo)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสภาพอากาศได้' })
  }
})

app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    port: port,
    message: 'Weather App สำหรับขอนแก่น 🌤️'
  })
})

app.listen(port, () => {
  console.log(`🚀 Test app listening on port ${port}`)
  console.log(`🌐 Visit: http://localhost:${port}`)
})