### **Edited README:**
```markdown
# Next.js Dashboard - Crypto, Weather & News  
A modern dashboard application built with **Next.js** that integrates **cryptocurrency data, weather forecasts, and news** in a single interface. The dashboard provides real-time updates and a responsive design for seamless use on any device.

![Dashboard Preview](https://via.placeholder.com/800x450?text=Dashboard+Preview)

## Features

### **Cryptocurrency Tracking**  
- Real-time price updates via **WebSocket**  
- Detailed information for major cryptocurrencies  
- Historical price charts with customizable time ranges  
- Auto-fallback to polling when WebSocket is unavailable  

### **Weather Forecasts**  
- Current weather conditions for multiple cities  
- 7-day weather forecasts with detailed metrics  
- **Temperature, humidity, wind speed, and more**  
- Supports **major global cities**, including Indian locations  

### **News Feed**  
- Latest **cryptocurrency and blockchain news**  
- Source attribution and timestamps  
- Direct links to full articles  

### **User Experience**  
- **Dark and light theme** support  
- Favorites system for both cities and cryptocurrencies  
- **Responsive design** for mobile, tablet, and desktop  
- **Real-time data refresh** with status indicators  

## **Technologies Used**
- **Next.js 15** with App Router  
- **TypeScript** for type safety  
- **Redux Toolkit** for state management  
- **Tailwind CSS** for styling  
- **WebSocket** for real-time data  
- **REST API integrations**  
- **Environment Variables** for configuration  

## **Getting Started**

### **Prerequisites**
- **Node.js 18.17** or later  
- **npm** or **yarn** package manager  

### **Installation**
```sh
git clone https://github.com/jhapriyavart10/weather-dashboard.git
cd nextjs-dashboard
npm install  # or yarn install
```

### **Environment Variables**
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
```

### **Development**
```sh
npm run dev  # or yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## **Deployment**

### **Vercel**
```sh
vercel --prod
```
Deployed link: [(https://nextjs-dashboard-three-chi-99.vercel.app/)]

### **Netlify**
1. Connect the GitHub repository to Netlify.  
2. Add **environment variables** in the Netlify dashboard.  
3. Deploy the project.

## **Project Structure**
```
/components
  ├── Crypto.tsx
  ├── Weather.tsx
  ├── News.tsx
/pages
  ├── index.tsx
  ├── api
      ├── crypto
      ├── weather
      ├── news
```

## **Features in Development**
- **User authentication**  
- **Customizable dashboard layouts**  
- **Additional data visualizations**  
- **Mobile app version**  

## **Contributing**
Contributions are welcome! Please feel free to submit a **Pull Request**.

## **License**
This project is licensed under the **MIT License** – see the LICENSE file for details.

## **Acknowledgements**
- **CoinGecko API** for cryptocurrency data  
- **OpenWeatherMap API** for weather forecasts  
- **NewsData.io** for news articles  

---

**Created by [Priyavart Jha](https://github.com/priyavart-jha)** 🚀  
