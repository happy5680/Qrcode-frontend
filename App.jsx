import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // *** 解決 'import.meta' 警告的關鍵設定 ***
  // 設定較新的 ECMAScript 目標版本 (例如 'es2021') 
  // 可以確保 Vite 能夠正確處理並注入 'import.meta.env' 變數，
  // 避免在建置時出現 "import.meta is not available in es2015" 的警告。
  build: {
    target: 'es2021', // 使用一個現代的目標環境來支持 import.meta.env
    outDir: 'dist',   // 建置輸出目錄
  },
  
  // 設定前端開發伺服器
  server: {
    host: '0.0.0.0', // 允許外部網路訪問 (在 Zeabur/容器環境中很有用)
    port: 5173,      // 開發端口
  }
});
