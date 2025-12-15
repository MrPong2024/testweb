const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>🚀 Test App Deployed!</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            margin: auto;
            max-width: 500px;
          }
          h1 { font-size: 2.5em; margin-bottom: 20px; }
          p { font-size: 1.2em; line-height: 1.6; }
          .success { color: #00ff88; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎉 Deployment Successful!</h1>
          <p>Your app is now running on <span class="success">Node.js</span></p>
          <p>🕐 Started at: ${new Date().toLocaleString('th-TH')}</p>
          <p>🌐 Port: ${port}</p>
          <p>📦 This is a test application deployed via our Auto Deploy System!</p>
        </div>
      </body>
    </html>
  `)
})

app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    port: port,
    message: 'Test app is working perfectly! 🚀'
  })
})

app.listen(port, () => {
  console.log(`🚀 Test app listening on port ${port}`)
  console.log(`🌐 Visit: http://localhost:${port}`)
})