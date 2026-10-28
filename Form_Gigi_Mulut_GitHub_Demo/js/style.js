document.addEventListener("DOMContentLoaded", function () {

  initKeterbatasanGerak();
  tambahMasalah();
  tambahMasalah();

  // Logic Gizi (Penurunan BB)
  const opsiTidak = document.getElementById("opsiTidak");
  const opsiTidakYakin = document.getElementById("opsiTidakYakin");
  const opsiYa = document.getElementById("opsiYa");
  const detailContainer = document.getElementById("opsiYaDetail");
  const radioDetail = document.querySelectorAll(".radioYaDetail");
  const skorField = document.getElementById("skorTotal");

  const radioMakan = document.querySelectorAll('input[name="asupanMakan"]');
  const skorAsupan = document.getElementById("skorAsupan");

  const totalSkor = document.getElementById("totalSkor");
  const peringatanSkor = document.getElementById("peringatanSkor");

  function updateTotalSkor() {
    const skor1 = parseInt(skorField.value) || 0;
    const skor2 = parseInt(skorAsupan.value) || 0;
    const total = skor1 + skor2;
    totalSkor.value = total;
    peringatanSkor.textContent = total >= 2 ? "Pasien berisiko malnutrisi, konsultasikan ke ahli gizi." : "";
  }

  document.querySelectorAll('input[name="penurunanBB"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if (opsiTidak.checked || opsiTidakYakin.checked) {
        detailContainer.style.display = "none";
        skorField.value = radio.value;
      } else if (opsiYa.checked) {
        detailContainer.style.display = "block";
        skorField.value = "0";
      }
      updateTotalSkor();
    });
  });

  radioDetail.forEach(radio => {
    radio.addEventListener("change", () => {
      if (opsiYa.checked) {
        skorField.value = radio.value;
        updateTotalSkor();
      }
    });
  });

  radioMakan.forEach(radio => {
    radio.addEventListener("change", () => {
      skorAsupan.value = radio.value;
      updateTotalSkor();
    });
  });
});

// Fungsi: Keterbatasan Gerak
function initKeterbatasanGerak() {
  const yaRadio = document.getElementById("yaRadio");
  const tidakRadio = document.getElementById("tidakRadio");
  const checkboxSection = document.getElementById("checkboxSection");
  const pareseCheckbox = document.getElementById("parese");
  const keteranganParese = document.getElementById("keteranganParese");

  if (yaRadio && tidakRadio && checkboxSection && pareseCheckbox && keteranganParese) {
    yaRadio.addEventListener("change", function () {
      if (yaRadio.checked) {
        checkboxSection.classList.remove("d-none");
      }
    });

    tidakRadio.addEventListener("change", function () {
      if (tidakRadio.checked) {
        checkboxSection.classList.add("d-none");
        keteranganParese.classList.add("d-none");
        pareseCheckbox.checked = false;
      }
    });

    pareseCheckbox.addEventListener("change", function () {
      if (pareseCheckbox.checked) {
        keteranganParese.classList.remove("d-none");
      } else {
        keteranganParese.classList.add("d-none");
      }
    });
  }
}

// Fungsi: Riwayat Obat
function toggleObatTable() {
  const ada = document.getElementById('radioAdaObat').checked;
  document.getElementById('obatTableContainer').style.display = ada ? 'block' : 'none';
}

function tambahBarisObat() {
  const table = document.getElementById('obatTable').getElementsByTagName('tbody')[0];
  const rowCount = table.rows.length;
  const row = table.insertRow();
  row.innerHTML = `
    <td>${rowCount + 1}</td>
    <td><input type="text" class="form-control form-control-sm" name="nama_obat[]" style="font-size: 0.9rem;" /></td>
    <td><input type="text" class="form-control form-control-sm" name="dosis[]" style="font-size: 0.9rem;" /></td>
    <td><input type="text" class="form-control form-control-sm" name="cara_pemberian[]" style="font-size: 0.9rem;" /></td>
    <td><input type="text" class="form-control form-control-sm" name="frekuensi[]" style="font-size: 0.9rem;" /></td>
    <td><input type="text" class="form-control form-control-sm" name="waktu_tanggal[]" style="font-size: 0.9rem;" /></td>
    <td>
      <button type="button" class="btn btn-danger btn-sm" onclick="hapusBarisObat(this)" style="font-size: 0.85rem;">Hapus</button>
    </td>
  `;
  updateNomorObat();
}

function hapusBarisObat(btn) {
  const row = btn.closest('tr');
  row.remove();
  updateNomorObat();
}

function updateNomorObat() {
  const table = document.getElementById('obatTable').getElementsByTagName('tbody')[0];
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].cells[0].textContent = i + 1;
  }
}

// Fungsi Nyeri
function isiVAS(nyeri) {
  document.getElementById("vasInput").value = nyeri;
}

function toggleFormNyeri(formId) {
  const radioYaNyeri = document.getElementById('radioYa' + formId);
  const formGroup = document.getElementById('formGroup' + formId);
  formGroup.style.display = radioYaNyeri.checked ? 'block' : 'none';
}

// Fungsi IMT
function hitungIMT() {
  const bb = parseFloat(document.getElementById("bb").value);
  const tb = parseFloat(document.getElementById("tb").value);
  const imt = tb > 0 ? bb / ((tb / 100) ** 2) : NaN;
  document.getElementById("imt").value = !isNaN(imt) ? imt.toFixed(2) : "Input tidak valid";
}

// Penyakit Terdahulu
function toggleForm(prefix) {
  const yaChecked = document.getElementById('radioYa' + prefix).checked;
  const group = document.getElementById('formGroup' + prefix);
  group.style.display = yaChecked ? 'block' : 'none';
}

function showLainnyaInput() {
  const select = document.getElementById("riwayatpenyakit");
  const textbox = document.getElementById("lainnyaTextbox");
  textbox.style.display = select.value === "Lain" ? "block" : "none";
}

// Fungsi Prioritas Masalah
function tambahMasalah() {
  const ul = document.getElementById("masalahList");
  if (!ul) return;

  const li = document.createElement("li");
  li.className = "mb-2 d-flex align-items-center gap-2";

  li.innerHTML = `
    <span class="nomor"></span>
    <input type="text" class="form-control" style="max-width: 400px;" placeholder="Masukkan masalah">
    <button type="button" class="btn btn-danger btn-sm" onclick="hapusMasalah(this)">Hapus</button>
  `;

  ul.appendChild(li);
  updateNomor();
}

function hapusMasalah(button) {
  const li = button.closest("li");
  if (li) li.remove();
  updateNomor();
}

function updateNomor() {
  const items = document.querySelectorAll("#masalahList .nomor");
  items.forEach((el, index) => {
    el.textContent = `${index + 1}.`;
  });
}


  // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Fungsi untuk mendapatkan waktu saat ini dalam format HH:MM (24 jam)
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Saat halaman dimuat, set semua input[type="date"] dan input[type="time"]
  window.addEventListener('DOMContentLoaded', () => {
    const today = getTodayDate();
    const now = getCurrentTime();

    // Isi semua input tanggal
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      input.value = today;
    });

    // Isi semua input jam
    const timeInputs = document.querySelectorAll('input[type="time"]');
    timeInputs.forEach(input => {
      input.value = now;
    });
  });


  

    