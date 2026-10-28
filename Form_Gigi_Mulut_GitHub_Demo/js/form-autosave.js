/* Shared form persistence and navigation for the static GitHub Pages demo. */
const FORM_PAGES = [
  "data_awal.html", "identitas_pasien.html", "riwayat_kesehatan.html",
  "riwayat_alergi.html", "riwayat_penggunaan_obat.html", "tanda_vital.html",
  "aktivitas.html", "nutrisi_gizi.html", "pengkajian_fungsional.html",
  "odontogram.html", "perilaku.html", "keamanan.html", "kebutuhan_edukasi.html",
  "perencanaan_pulang.html", "masalah_keperawatan.html", "Review.html", "tanda_tangan.html"
];

function collectFormData(form) {
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (!el.name || el.type === 'button' || el.type === 'submit' || el.type === 'reset') return;
    if (el.type === 'checkbox') {
      if (!Array.isArray(data[el.name])) data[el.name] = [];
      if (el.checked) data[el.name].push(el.value);
    } else if (el.type === 'radio') {
      if (el.checked) data[el.name] = el.value;
    } else {
      data[el.name] = el.value;
    }
  });
  return data;
}

function restoreFormData(form, data) {
  if (!data || typeof data !== 'object') return;
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (!el.name || !(el.name in data)) return;
    if (el.type === 'checkbox') {
      const values = Array.isArray(data[el.name]) ? data[el.name] : [data[el.name]];
      el.checked = values.includes(el.value);
    } else if (el.type === 'radio') {
      el.checked = data[el.name] === el.value;
    } else if (el.type !== 'file') {
      el.value = data[el.name] ?? '';
    }
  });
}

function getNextPage(currentPage) {
  const i = FORM_PAGES.indexOf(currentPage);
  return i >= 0 && i < FORM_PAGES.length - 1 ? FORM_PAGES[i + 1] : null;
}
function getPreviousPage(currentPage) {
  const i = FORM_PAGES.indexOf(currentPage);
  return i > 0 ? FORM_PAGES[i - 1] : null;
}
function showToast(message) {
  const textEl = document.getElementById('toast-message');
  const toastEl = document.getElementById('liveToast');
  if (textEl && toastEl && window.bootstrap?.Toast) {
    textEl.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  } else if (message) {
    const notice = document.getElementById('demo-notice');
    if (notice) { notice.textContent = message; notice.classList.remove('d-none'); }
    else console.info(message);
  }
}
function saveCurrentForm(form) {
  const key = form.dataset.page || location.pathname.split('/').pop();
  const data = collectFormData(form);
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem('rsudTarutungLastSavedAt', new Date().toISOString());
  return data;
}
function kembali() {
  const form = document.getElementById('formPasien');
  if (!form) return;
  saveCurrentForm(form);
  const prev = getPreviousPage(form.dataset.page || location.pathname.split('/').pop());
  location.href = prev || 'index.html';
}
function updateForm() {
  const form = document.getElementById('formPasien');
  if (!form) return;
  form.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = false; });
  showToast('Silakan ubah data, lalu simpan kembali.');
}
function resetForm() {
  const form = document.getElementById('formPasien');
  if (!form) return;
  if (confirm('Hapus semua isian pada halaman ini?')) {
    localStorage.removeItem(form.dataset.page || location.pathname.split('/').pop());
    location.reload();
  }
}
function showConfirmationToast(message, onConfirm) {
  if (confirm(message) && typeof onConfirm === 'function') onConfirm();
}
function toggleObatTable() {
  const table = document.getElementById('obatTableContainer');
  const radio = document.getElementById('radioAdaObat');
  if (table && radio) table.style.display = radio.checked ? 'block' : 'none';
}
function setupRealtimeValidation(containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', () => {
    el.classList.toggle('is-valid', !!el.value.trim());
    el.classList.toggle('is-invalid', !el.value.trim());
  }));
}
function validateSumberData() {
  const a = document.getElementById('checkpasien');
  const b = document.getElementById('checkkeluarga');
  const c = document.getElementById('lainnyasumberdata');
  if (!a && !b && !c) return true;
  const valid = !!(a?.checked || b?.checked || c?.value.trim());
  document.getElementById('sumberError')?.classList.toggle('d-none', valid);
  if (!valid) showToast('Pilih atau isi salah satu sumber data.');
  return valid;
}
function validateCheckboxGroup() {
  const checks = [...document.querySelectorAll('input[name="sumberdata[]"]')];
  const other = document.getElementById('lainnyasumberdata');
  if (!checks.length && !other) return true;
  const ok = checks.some(el => el.checked) || !!other?.value.trim();
  document.getElementById('sumberError')?.classList.toggle('d-none', ok);
  if (!ok) showToast('Pilih minimal satu sumber data.');
  return ok;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formPasien');
  if (!form) return;
  const pageKey = form.dataset.page || location.pathname.split('/').pop();
  try { restoreFormData(form, JSON.parse(localStorage.getItem(pageKey) || 'null')); } catch (e) { console.warn('Data demo tidak dapat dibaca.', e); }
  const rm = document.getElementById('RM1');
  if (rm) rm.addEventListener('input', () => {
    const ok = /^\d{6}$/.test(rm.value.trim());
    rm.classList.toggle('is-valid', ok); rm.classList.toggle('is-invalid', !!rm.value && !ok);
  });
  form.addEventListener('submit', (event) => {
    // Keep page-specific validation and handlers, but ensure static demo data is saved.
    if (form.classList.contains('needs-validation') && !form.checkValidity()) {
      form.classList.add('was-validated');
      event.preventDefault();
      showToast('Periksa kembali kolom yang wajib diisi.');
      return;
    }
    if (!validateSumberData()) { event.preventDefault(); return; }
    try { saveCurrentForm(form); }
    catch (e) { event.preventDefault(); showToast('Penyimpanan browser gagal. Periksa ruang penyimpanan.'); return; }
    const next = getNextPage(pageKey);
    if (next) {
      // Allow page-specific submit handlers to finish before navigating.
      event.preventDefault();
      showToast('Data demo tersimpan di browser ini. Membuka halaman berikutnya…');
      setTimeout(() => { location.href = next; }, 650);
    } else {
      event.preventDefault();
      showToast('Semua bagian formulir telah disimpan pada browser ini.');
      setTimeout(() => { location.href = 'konfirmasi_akhir.html'; }, 650);
    }
  });
});
