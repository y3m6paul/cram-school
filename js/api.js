// ========== JSONP 版本 api.js（解決 CORS 問題）==========

// 請將此網址替換為您的 Apps Script 部署網址
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxVG0I-55PzuNCZ94RXQ2KWk85FkwZw-jFgw0O97W8fvrObD05yTa6WaJGblOOX-KoA/exec';

class CramSchoolAPI {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // JSONP 請求方法（解決 CORS）
  jsonpRequest(params) {
    return new Promise((resolve, reject) => {
      // 建立唯一的 callback 名稱
      const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
      
      // 建立 callback 函數
      window[callbackName] = function(data) {
        // 清理
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // 解析資料
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch(e) {}
        }
        resolve(data);
      };
      
      // 建立請求 URL
      const urlParams = new URLSearchParams(params);
      urlParams.append('callback', callbackName);
      const url = `${this.baseUrl}?${urlParams.toString()}`;
      
      // 建立 script 標籤
      const script = document.createElement('script');
      script.src = url;
      script.onerror = function() {
        // 錯誤處理
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        reject(new Error('網路連線錯誤'));
      };
      
      // 發送請求
      document.body.appendChild(script);
      
      // 超時處理（10秒）
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          reject(new Error('請求超時'));
        }
      }, 10000);
    });
  }

  // 登入（使用 JSONP GET 請求）
  async login(userType, password) {
    return this.jsonpRequest({
      action: 'login',
      userType: userType,
      password: password
    });
  }

  // 健康檢查
  async healthCheck() {
    return this.jsonpRequest({ action: 'health' });
  }

  // 取得班級列表
  async getClassList() {
    return this.jsonpRequest({ action: 'getClassList' });
  }

  // 取得學生名單
  async getStudents(className = '') {
    return this.jsonpRequest({ 
      action: 'getStudents', 
      class: className 
    });
  }
}

// 建立全域實例
const api = new CramSchoolAPI();
