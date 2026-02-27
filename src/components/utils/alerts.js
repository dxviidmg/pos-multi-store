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

export const showInfo = (title, text = "") => {
  showAlert("info", title, text);
};
