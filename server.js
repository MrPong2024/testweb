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
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%);
            color: white;
            min-height: 100vh;
            background-attachment: fixed;
          }
          .container {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 40px;
            margin: auto;
            max-width: 600px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          h1 { 
            font-size: 2.8em; 
            margin-bottom: 30px; 
            text-align: center;
            background: linear-gradient(45deg, #fff, #a29bfe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .weather-card {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .loading {
            text-align: center;
            font-size: 1.2em;
            color: #fdcb6e;
          }
          .weather-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .temp {
            font-size: 3em;
            font-weight: bold;
            color: #fdcb6e;
          }
          .description {
            font-size: 1.3em;
            margin-bottom: 10px;
            color: #ddd;
          }
          .details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          .detail-item {
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .detail-label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-bottom: 5px;
          }
          .detail-value {
            font-size: 1.2em;
            font-weight: bold;
          }
          .error {
            color: #ff7675;
            text-align: center;
            padding: 20px;
          }
          .refresh-btn {
            background: linear-gradient(45deg, #00b894, #00a085);
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            font-size: 1em;
            margin: 20px auto;
            display: block;
            transition: transform 0.2s;
          }
          .refresh-btn:hover {
            transform: scale(1.05);
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            opacity: 0.7;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌤️ สภาพอากาศขอนแก่น</h1>
          
          <div class="weather-card">
            <div id="weather-content" class="loading">
              <div>⏳ กำลังโหลดข้อมูลสภาพอากาศ...</div>
            </div>
          </div>
          
          <button class="refresh-btn" onclick="loadWeather()">🔄 อัพเดทข้อมูล</button>
          
          <div class="footer">
            <p>📍 จังหวัดขอนแก่น, ประเทศไทย</p>
            <p>🕐 อัพเดทล่าสุด: <span id="last-update">${new Date().toLocaleString('th-TH')}</span></p>
          </div>
        </div>

        <script>
          async function loadWeather() {
            const content = document.getElementById('weather-content');
            const updateTime = document.getElementById('last-update');
            
            content.innerHTML = '<div class="loading">⏳ กำลังโหลดข้อมูลสภาพอากาศ...</div>';
            
            try {
              const response = await fetch('/api/weather');
              const data = await response.json();
              
              if (data.error) {
                content.innerHTML = \`<div class="error">❌ \${data.error}</div>\`;
                return;
              }
              
              content.innerHTML = \`
                <div class="weather-info">
                  <div>
                    <div class="temp">\${data.temperature}°C</div>
                    <div class="description">🌤️ \${data.description}</div>
                  </div>
                </div>
                <div class="details">
                  <div class="detail-item">
                    <div class="detail-label">💧 ความชื้น</div>
                    <div class="detail-value">\${data.humidity}%</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">💨 ความเร็วลม</div>
                    <div class="detail-value">\${data.windspeed} กม./ชม.</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">📍 สถานที่</div>
                    <div class="detail-value">\${data.location}</div>
                  </div>
                </div>
              \`;
              
              updateTime.textContent = new Date().toLocaleString('th-TH');
              
            } catch (error) {
              content.innerHTML = '<div class="error">❌ เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
              console.error('Error:', error);
            }
          }
          
          // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
          window.onload = loadWeather;
          
          // รีเฟรชอัตโนมัติทุก 5 นาที
          setInterval(loadWeather, 300000);
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