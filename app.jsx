import React, { useState } from 'react';

// === 部署說明 (已更新) ===
// 這裡必須是「Base URL」加上後端 index.js 定義的「/api/generate」
const API_URL = "https://mean1207.zeabur.app/api/generate"; 

// 為了讓你在這個視窗能看到效果，我寫了一個模擬後端回應的函數
// 實際部署時，這段 mockApiCall 不需要使用，程式會直接 fetch 上面的 API_URL
const mockApiCall = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 這裡僅是用前端套件模擬後端行為，讓你預覽 UI
      // 實際專案會是真的發送網路請求
      resolve({
        success: true,
        // 回傳一個簡單的 Base64 圖片作為示意 (這裡無法在瀏覽器端動態生成真 QR，僅回傳假圖示)
        // 在真實對接後端時，這裡會是真實的 QR Code
        mock: true 
      });
    }, 800);
  });
};

export default function App() {
  // 1. 定義狀態 (State)
  const [text, setText] = useState('https://www.google.com');
  const [colorDark, setColorDark] = useState('#000000');
  const [colorLight, setColorLight] = useState('#ffffff');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. 處理產生按鈕點擊
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setQrImage('');

    try {
      let resultData;
      
      // 判斷是否為預覽模式
      // 注意：因為你已經換成真實的 Zeabur 網址，這裡會自動跳到 else (真實模式)
      if (API_URL.includes("mock-api")) {
        // --- 模擬模式 (這裡不會被執行到，除非你把網址改回 mock-api) ---
        const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=${colorDark.replace('#', '')}&bgcolor=${colorLight.replace('#', '')}`);
        const blob = await response.blob();
        resultData = URL.createObjectURL(blob); // 轉成圖片網址
      } else {
        // --- 真實模式 (現在會執行這裡) ---
        // 這會發送 POST 請求到 https://mean1207.zeabur.app/api/generate
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            colorDark: colorDark,
            colorLight: colorLight
          }),
        });

        const data = await response.json();
        
        // 增加錯誤處理的細節，方便除錯
        if (!response.ok) {
           throw new Error(data.error || `Server Error: ${response.status}`);
        }
        if (!data.success) {
           throw new Error(data.error || 'Failed to generate');
        }
        
        resultData = data.result; // 後端回傳的 Base64 字串
      }

      setQrImage(resultData);

    } catch (err) {
      setError(`連線失敗: ${err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          進階 QR Code 產生器
        </h1>

        {/* 輸入區塊 */}
        <div className="space-y-4">
          
          {/* 網址輸入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目標網址 / 文字</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="輸入 https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* 顏色選擇區 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QR 顏色</label>
              <div className="flex items-center space-x-2 border p-2 rounded-lg">
                <input
                  type="color"
                  value={colorDark}
                  onChange={(e) => setColorDark(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs text-gray-500">{colorDark}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">背景顏色</label>
              <div className="flex items-center space-x-2 border p-2 rounded-lg">
                <input
                  type="color"
                  value={colorLight}
                  onChange={(e) => setColorLight(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs text-gray-500">{colorLight}</span>
              </div>
            </div>
          </div>

          {/* 按鈕 */}
          <button
            onClick={handleGenerate}
            disabled={loading || !text}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all
              ${loading || !text 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                產生中...
              </span>
            ) : '立即製作 QR Code'}
          </button>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-200">
            {error}
          </div>
        )}

        {/* 結果顯示區 */}
        {qrImage && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="relative inline-block group">
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-inner">
                 {/* 這裡是重點：直接顯示後端回傳的圖片 */}
                <img 
                  src={qrImage} 
                  alt="Generated QR Code" 
                  className="w-48 h-48 object-contain mx-auto"
                />
              </div>
              
              {/* Logo 覆蓋示意 (進階功能) */}
              {/* 因為我們在後端設了高容錯率，你可以用 CSS 把 Logo 疊在中間 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 pointer-events-none">
                <span className="text-xs font-bold text-indigo-600">Logo</span>
              </div>
            </div>

            <div className="mt-4">
              <a 
                href={qrImage} 
                download="qrcode.png"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline cursor-pointer"
              >
                下載圖片
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}