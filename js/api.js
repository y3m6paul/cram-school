// js/api.js - 請確認內容完全一致
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxLmdK3aGW80Lvx9n0h-sp0Q_Q3ImcK8koJkblHdaZutobHGo-Q7CUt0kMX7jg7guCl/exec';

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
