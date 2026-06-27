const showMessage = (elementId: string, type: 'success' | 'error', text: string) => {
  const el = document.getElementById(elementId) as HTMLDivElement;
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
  el.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => { el.style.display = 'none'; }, 3000);
  }
};

const hideMessage = (elementId: string) => {
  const el = document.getElementById(elementId) as HTMLDivElement;
  if (el) el.style.display = 'none';
};

const fetchAndUpdateCount = async () => {
  const countDisplay = document.getElementById('count-display') as HTMLSpanElement;
  
  try {
    const response = await window.tableAPI.countTables();
    
    if (response.success && response.value !== undefined) {
      countDisplay.textContent = response.value.toString();
      hideMessage('count-message');
    } else {
      showMessage('count-message', 'error', response.error || 'Error.');
    }
  } catch (error) {
    showMessage('count-message', 'error', 'Error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
  const countBtn = document.getElementById('count-btn') as HTMLButtonElement;
  const nameInput = document.getElementById('table-name') as HTMLInputElement;
  const passwordInput = document.getElementById('table-password') as HTMLInputElement;

  fetchAndUpdateCount();

  saveBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const password = passwordInput.value;

    if (!name || !password) {
      showMessage('form-message', 'error', 'Insert both values.');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'just a second...';

    try {
      const response = await window.tableAPI.createTable(name, password);

      if (response.success) {
        showMessage('form-message', 'success', `Table "${name}" created succesfully`);
        nameInput.value = '';
        passwordInput.value = '';
        await fetchAndUpdateCount();
      } else {
        showMessage('form-message', 'error', response.error || 'Error.');
      }
    } catch (error) {
      showMessage('form-message', 'error', 'Errore IPC.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salva Tabella';
    }
  });

  countBtn.addEventListener('click', async () => {
    await fetchAndUpdateCount();
    showMessage('count-message', 'success', 'Updated');
  });
});