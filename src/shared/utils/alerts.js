import Swal from "sweetalert2";

export const showAlert = (icon, title, text = "", timer = 5000) => {
  Swal.fire({ icon, title, text, timer });
};

export const showSuccess = (title, text = "") => {
  showAlert("success", title, text);
};

export const showError = (title, text = "") => {
  showAlert("error", title, text);
};

export const showWarning = (title, text = "") => {
  showAlert("warning", title, text);
};

export const showConfirm = async (title, text = "") => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  });
  return result.isConfirmed;
};
