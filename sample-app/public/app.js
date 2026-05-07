const checkBtn = document.getElementById('checkBtn');
const status = document.getElementById('status');

checkBtn.addEventListener('click', async () => {
  status.textContent = '確認中...';
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    status.textContent = `OK: ${data.app}`;
  } catch (_err) {
    status.textContent = 'エラー';
  }
});
