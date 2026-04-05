// js/api.js - API 呼叫封裝
// 請替換為您的 Apps Script 部署網址
const API_BASE_URL = https://script.google.com/macros/s/AKfycbxLmdK3aGW80Lvx9n0h-sp0Q_Q3ImcK8koJkblHdaZutobHGo-Q7CUt0kMX7jg7guCl/exec;

class CramSchoolAPI {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // 通用 POST 請求
  async post(action, data) {
    try {
      const response = await fetch(`${this.baseUrl}`, {
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

  // 取得點名記錄
  async getAttendance(studentId = '') {
    return this.get({ action: 'getAttendance', studentId: studentId });
  }

  // 儲存點名
  async saveAttendance(records) {
    return this.post('saveAttendance', { records });
  }

  // 取得作業列表
  async getHomework(className = '') {
    return this.get({ action: 'getHomework', class: className });
  }

  // 發布作業
  async saveHomework(homeworkData) {
    return this.post('saveHomework', homeworkData);
  }

  // 取得公告
  async getAnnouncements() {
    return this.get({ action: 'getAnnouncements' });
  }

  // 發布公告
  async saveAnnouncement(announcementData) {
    return this.post('saveAnnouncement', announcementData);
  }

  // 請假申請
  async applyLeave(leaveData) {
    return this.post('applyLeave', leaveData);
  }

  // 健康檢查
  async healthCheck() {
    return this.get({ action: 'health' });
  }
}

// 建立全域實例
const api = new CramSchoolAPI();
