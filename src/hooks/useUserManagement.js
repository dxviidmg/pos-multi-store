import { useState } from "react";
import { getUser, updateUser, changePassword } from "../api/users";
import Swal from "sweetalert2";

export const useUserManagement = () => {
  const [editUserModal, setEditUserModal] = useState({ open: false, userId: null, data: {} });
  const [changePasswordModal, setChangePasswordModal] = useState({ open: false, userId: null });
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleOpenEditUser = async (userId) => {
    try {
      const response = await getUser(userId);
      setEditUserModal({ open: true, userId, data: response.data });
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error');
    }
  };

  const handleCloseEditUser = () => {
    setEditUserModal({ open: false, userId: null, data: {} });
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserModal(prev => ({ ...prev, data: { ...prev.data, [name]: value } }));
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(editUserModal.userId, editUserModal.data);
      Swal.fire('Guardado', 'Usuario actualizado correctamente', 'success');
      handleCloseEditUser();
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
    }
  };

  const handleOpenChangePassword = (userId) => {
    setChangePasswordModal({ open: true, userId });
    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
  };

  const handleCloseChangePassword = () => {
    setChangePasswordModal({ open: false, userId: null });
    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSavePassword = async () => {
    try {
      await changePassword(changePasswordModal.userId, { 
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
        user_id: changePasswordModal.userId
      });
      Swal.fire('Guardado', 'Contraseña cambiada correctamente', 'success');
      handleCloseChangePassword();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña', 'error');
    }
  };

  return {
    editUserModal,
    changePasswordModal,
    passwordData,
    showPasswords,
    handleOpenEditUser,
    handleCloseEditUser,
    handleEditUserChange,
    handleSaveUser,
    handleOpenChangePassword,
    handleCloseChangePassword,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSavePassword,
  };
};
