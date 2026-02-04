document.addEventListener("DOMContentLoaded", function () {

  const kegiatanSelect = document.getElementById('kegiatan');
  const detailTextarea = document.getElementById('detailKegiatan');
  
  const templates = {
    Pengiriman: "Pengiriman perangkat ke lokasi ...",
    Pemeriksaan: "Pemeriksaan kondisi perangkat ...",
    Pemasangan: "Pemasangan perangkat di ...",
    Perbaikan: "Perbaikan perangkat karena ...",
    Pengembalian: "Pengembalian perangkat ke ...",
    Pemindahan: "Pemindahan perangkat dari ... ke ..."
  };

  kegiatanSelect.addEventListener('change', () => {
    if (kegiatanSelect.value !== "") {
      detailTextarea.disabled = false;
      detailTextarea.value = templates[kegiatanSelect.value] || "";
      detailTextarea.focus();
    } else {
      detailTextarea.disabled = true;
      detailTextarea.value = "";
    }
  });


  const devicesDiv = document.getElementById('devices');
  const addBtn = document.getElementById('addDevice');

  function renderDevices() {
    const boxes = devicesDiv.querySelectorAll('.device-box');
    boxes.forEach((box, index) => {
      box.querySelector('h3').innerText = `Perangkat ${index + 1}`;
    });
  }

  function addDevice() {
    const div = document.createElement('div');
    div.className = "device-box";

    div.innerHTML = `
      <h3>Perangkat</h3>

      <input placeholder="Nama Barang" required>
      <input placeholder="Merk & Model" required>
      <input placeholder="Nomor Seri" required>

      <select required>
        <option value="">-- Pilih Kondisi --</option>
        <option value="Baik">Baik</option>
        <option value="Rusak Ringan">Rusak Ringan</option>
        <option value="Rusak Berat">Rusak Berat</option>
        <option value="Hilang">Hilang</option>
      </select>

      <button type="button" class="delete-btn">Hapus</button>
    `;

    div.querySelector('.delete-btn').addEventListener('click', () => {
      div.remove();
      renderDevices();
    });

    devicesDiv.appendChild(div);
    renderDevices();
  }

  addBtn.addEventListener('click', addDevice);

  // default 1 perangkat
  addDevice();

});


