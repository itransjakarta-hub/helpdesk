const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwFuh8_DHL6j38kelemt7aDywhbSoNGEbnV4E8CaQ-LLbIg9keNKcBw5VFRcSjMTVE9/exec";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("logForm");
  const loading = document.getElementById("loadingOverlay");
  const modal = document.getElementById("successModal");
  const preview = document.getElementById("previewData");
  const pdfLink = document.getElementById("pdfLink");

  // ===== KEGIATAN UX =====
  const kegiatanSelect = document.getElementById("kegiatan");
  const detailTextarea = document.getElementById("detailKegiatan");

  detailTextarea.disabled = true;

  kegiatanSelect.addEventListener("change", () => {
    if (kegiatanSelect.value) {
      detailTextarea.disabled = false;
      detailTextarea.focus();
    } else {
      detailTextarea.disabled = true;
      detailTextarea.value = "";
    }
  });

  // ===== DEVICE HANDLER =====
  const devicesDiv = document.getElementById("devices");
  const addBtn = document.getElementById("addDevice");

  function renderDevices() {
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

    div.querySelector(".delete-btn").addEventListener("click", () => {
      div.remove();
      renderDevices();
    });

    devicesDiv.appendChild(div);
    renderDevices();
  }

  addBtn.addEventListener("click", addDevice);
  addDevice();

  // ===== SUBMIT FORM =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.classList.remove("hidden");

    try {
      const devices = [...document.querySelectorAll(".device-box")].map(b => ({
        namaBarang: b.querySelectorAll("input")[0].value,
        merkModel: b.querySelectorAll("input")[1].value,
        nomorSeri: b.querySelectorAll("input")[2].value,
        kondisi: b.querySelector("select").value
      }));

      const data = {
        namaEngineer: form[0].value,
        nikEngineer: form[1].value,
        jabatanEngineer: form[2].value,
        tanggal: form[3].value,
        jam: form[4].value,
        kegiatan: form[5].value,
        detailKegiatan: form[6].value,
        namaUser: form[7].value,
        nikUser: form[8].value,
        jabatanUser: form[9].value,
        devices
      };

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.status !== "success") {
        throw result.message || "Gagal menyimpan data";
      }

      loading.classList.add("hidden");

      preview.innerHTML = `
        <p><b>Engineer:</b> ${data.namaEngineer}</p>
        <p><b>Kegiatan:</b> ${data.kegiatan}</p>
        <p><b>User:</b> ${data.namaUser}</p>
        <p><b>Jumlah Perangkat:</b> ${devices.length}</p>
      `;

      pdfLink.href = result.pdfUrl;
      modal.classList.add("show");

    } catch (err) {
      loading.classList.add("hidden");
      alert("Gagal menyimpan data");
      console.error(err);
    }
  });

}); // 🔴 DOMContentLoaded CLOSED PROPERLY

// ===== CLOSE MODAL =====
function closeModal() {
  document.getElementById("successModal").classList.remove("show");
  document.getElementById("logForm").reset();
  document.getElementById("devices").innerHTML = "";
}
