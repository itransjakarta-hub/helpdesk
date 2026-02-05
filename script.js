const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwFuh8_DHL6j38kelemt7aDywhbSoNGEbnV4E8CaQ-LLbIg9keNKcBw5VFRcSjMTVE9/exec";

// =====================
// ELEMENT
// =====================
const form = document.getElementById("logForm");
const loading = document.getElementById("loadingOverlay");
const modal = document.getElementById("successModal");
const preview = document.getElementById("previewData");
const pdfLink = document.getElementById("pdfLink");

const kegiatanSelect = document.getElementById("kegiatan");
const detailTextarea = document.getElementById("detailKegiatan");

const devicesDiv = document.getElementById("devices");
const addDeviceBtn = document.getElementById("addDevice");

// =====================
// STATE AWAL (INI KRUSIAL)
// =====================
loading.classList.add("hidden");
modal.classList.add("hidden");
detailTextarea.disabled = true;

// =====================
// UX KECIL TAPI PENTING
// =====================
kegiatanSelect.addEventListener("change", () => {
  if (kegiatanSelect.value) {
    detailTextarea.disabled = false;
    detailTextarea.focus();
  } else {
    detailTextarea.disabled = true;
    detailTextarea.value = "";
  }
});

// =====================
// DEVICE HANDLER
// =====================
function renderDeviceTitle() {
  document.querySelectorAll(".device-box").forEach((box, i) => {
    box.querySelector("h3").innerText = `Perangkat ${i + 1}`;
  });
}

function addDevice() {
  const div = document.createElement("div");
  div.className = "device-box";

  div.innerHTML = `
    <h3>Perangkat</h3>
    <input placeholder="Nama Barang" required>
    <input placeholder="Merk & Model" required>
    <input placeholder="Nomor Seri" required>
    <select required>
      <option value="">-- Pilih Kondisi --</option>
      <option>Baik</option>
      <option>Rusak Ringan</option>
      <option>Rusak Berat</option>
      <option>Hilang</option>
    </select>
    <button type="button" class="delete-btn">Hapus</button>
  `;

  div.querySelector(".delete-btn").onclick = () => {
    div.remove();
    renderDeviceTitle();
  };

  devicesDiv.appendChild(div);
  renderDeviceTitle();
}

addDeviceBtn.addEventListener("click", addDevice);
addDevice(); // default 1 device

// =====================
// SUBMIT FORM
// =====================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  loading.classList.remove("hidden");

  const devices = [...document.querySelectorAll(".device-box")].map(box => ({
    namaBarang: box.querySelectorAll("input")[0].value,
    merkModel: box.querySelectorAll("input")[1].value,
    nomorSeri: box.querySelectorAll("input")[2].value,
    kondisi: box.querySelector("select").value
  }));

  const data = {
    namaEngineer: form.namaEngineer.value,
    nikEngineer: form.nikEngineer.value,
    jabatanEngineer: form.jabatanEngineer.value,
    tanggal: form.tanggal.value,
    jam: form.jam.value,
    kegiatan: form.kegiatan.value,
    detailKegiatan: form.detailKegiatan.value,
    namaUser: form.namaUser.value,
    nikUser: form.nikUser.value,
    jabatanUser: form.jabatanUser.value,
    devices: devices
  };

  fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      loading.classList.add("hidden");

      if (result.status !== "success") {
        alert("Gagal menyimpan data");
        console.error(result);
        return;
      }

      preview.innerHTML = `
        <p><b>Engineer:</b> ${data.namaEngineer}</p>
        <p><b>Kegiatan:</b> ${data.kegiatan}</p>
        <p><b>User:</b> ${data.namaUser}</p>
        <p><b>Jumlah Perangkat:</b> ${devices.length}</p>
      `;

      pdfLink.href = result.pdfUrl;
      modal.classList.remove("hidden");
    })
    .catch(err => {
      loading.classList.add("hidden");
      alert("Terjadi kesalahan saat submit");
      console.error(err);
    });
});

// =====================
// CLOSE MODAL
// =====================
function closeModal() {
  modal.classList.add("hidden");
  form.reset();
  devicesDiv.innerHTML = "";
  addDevice();
  detailTextarea.disabled = true;
}
