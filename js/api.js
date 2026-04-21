const API_URL = 'https://script.google.com/macros/s/AKfycbxtmbZK9aoAgX12Nch0hIfViRO7h6px-kPuYyKqKDgvMgXloZuWsO7NSzS-na6lH0PSww/exec';

async function call(action, data = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data })
  });
  return await res.json();
}

const api = {
  login: (userType, password) => call('login', { userType, password }),
  getHomework: () => call('getHomework'),
  publishHomework: (data) => call('publishHomework', { data }),
  deleteHomework: (id) => call('deleteHomework', { homeworkId: id }),
  getStudents: () => call('getStudents'),
  uploadHomework: (file, fileName, homeworkId, studentName) => 
    call('uploadHomework', { file, fileName, homeworkId, studentName }),
  checkSubmission: (homeworkId, studentName) => 
    call('checkSubmission', { homeworkId, studentName })
};
