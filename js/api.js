// js/api.js - 請確認內容完全一致
const API_BASE_URL = // ========== 最簡化版本 Code.gs（確保 CORS 正確）==========

function doPost(e) {
  // 解析請求資料
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  // 登入邏輯
  if (action === "login") {
    const { userType, password } = data;
    const passwords = { teacher: "110", admin: "0502", parent: "931" };
    
    if (passwords[userType] === password) {
      const result = { success: true, message: "登入成功", userType: userType };
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      const result = { success: false, message: "密碼錯誤" };
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // 預設回應
  const result = { success: false, message: "未知的請求" };
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: "API 運行中" }))
    .setMimeType(ContentService.MimeType.JSON);
}';

class CramSchoolAPI {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // 通用 POST 請求
  async post(action, data) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: '網路連線錯誤' };
    }
  }

  // 通用 GET 請求
  async get(params) {
    try {
      const url = new URL(this.baseUrl);
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors'
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: '網路連線錯誤' };
    }
  }

  // 登入
  async login(userType, password) {
    return this.post('login', { userType, password });
  }

  // 取得學生名單
  async getStudents(className = '') {
    return this.get({ action: 'getStudents', class: className });
  }

  // 取得班級列表
  async getClassList() {
    return this.get({ action: 'getClassList' });
  }

  // 健康檢查
  async healthCheck() {
    return this.get({ action: 'health' });
  }
}

const api = new CramSchoolAPI();
