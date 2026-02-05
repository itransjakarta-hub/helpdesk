const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwFuh8_DHL6j38kelemt7aDywhbSoNGEbnV4E8CaQ-LLbIg9keNKcBw5VFRcSjMTVE9/exec";

document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENT =====
  const form = document.getElementById("logForm");
  const loading = document.getElementById("loadingOverlay");
  const modal = document.getElementById("successModal");
  const preview = document.getElementById("previewData");
  const pdfBtn = document.getElementById("downloadPdf");
  const closeBtn = document.getElementById("closeModal");

  const kegiatanSelect = document.getElementById("kegiatan");
  const detailTextarea = document.getElementById("detail");

  // ===== PAKSA STATE AWAL (ANTI NYANGKUT) =====
  loading.classList.add("hidden");
  modal.classList.add("hidden");
  detailTextarea.disabled = true;

  // ===== UX =====
  kegiatanSelect.addEventListener("change", () => {
    detailTextarea.disabled = !kegiatanSelect.value;
    if (!kegiatanSelect.value) detailTextarea.value = "";
  });

  // ===== SUBMIT FORM =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loading.classList.remove("hidden");

    const data = {
      namaEngineer: document.getElementById("nama").value,
      nikEngineer: document.getElementById("nik").value,
      jabatanEngineer: document.getElementById("jabatan").value,
      kegiatan: kegiatanSelect.value,
      detailKegiatan: detailTextarea.value
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((result) => {
        loading.classList.add("hidden");

        if (!result.success) {
          alert("Gagal menyimpan data");
          return;
        }

        preview.innerHTML = `
          Nama Engineer : ${data.namaEngineer}
          Kegiatan      : ${data.kegiatan}
          Detail        : ${data.detailKegiatan || "-"}
        `;

        pdfBtn.onclick = () => {
          window.open(result.pdfUrl, "_blank");
        };

        modal.classList.remove("hidden");
      })
      .catch((err) => {
        loading.classList.add("hidden");
        alert("Terjadi kesalahan");
        console.error(err);
      });
  });

  // ===== CLOSE MODAL =====
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    form.reset();
    detailTextarea.disabled = true;
  });
});
