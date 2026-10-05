import { useCallback, useState } from "react";
import { getUser, updateUser, changePassword } from "../api/users";
import { showSuccess, showRequestError } from "../utils/alerts";

const CLOSED_EDIT_MODAL = { open: false, userId: null, data: {} };
const CLOSED_PASSWORD_MODAL = { open: false, userId: null };
const EMPTY_PASSWORDS = { old_password: '', new_password: '', confirm_password: '' };
const HIDDEN_PASSWORDS = { current: false, new: false, confirm: false };

export const useUserManagement = () => {
  const [editUserModal, setEditUserModal] = useState(CLOSED_EDIT_MODAL);
  const [changePasswordModal, setChangePasswordModal] = useState(CLOSED_PASSWORD_MODAL);
  const [passwordData, setPasswordData] = useState(EMPTY_PASSWORDS);
  const [showPasswords, setShowPasswords] = useState(HIDDEN_PASSWORDS);

  const handleOpenEditUser = useCallback(async (userId) => {
    try {
      const response = await getUser(userId);
      setEditUserModal({ open: true, userId, data: response.data });
    } catch (error) {
      showRequestError('cargar el usuario', error);
    }
  }, []);

  const handleCloseEditUser = useCallback(() => {
    setEditUserModal(CLOSED_EDIT_MODAL);
  }, []);

  const handleEditUserChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditUserModal(prev => ({ ...prev, data: { ...prev.data, [name]: value } }));
  }, []);

  const handleSaveUser = useCallback(async () => {
    try {
      await updateUser(editUserModal.userId, editUserModal.data);
      showSuccess('Guardado', 'Usuario actualizado');
      handleCloseEditUser();
    } catch (error) {
      showRequestError('actualizar el usuario', error);
    }
  }, [editUserModal.userId, editUserModal.data, handleCloseEditUser]);

  const handleOpenChangePassword = useCallback((userId) => {
    setChangePasswordModal({ open: true, userId });
    setPasswordData(EMPTY_PASSWORDS);
  }, []);

  const handleCloseChangePassword = useCallback(() => {
    setChangePasswordModal(CLOSED_PASSWORD_MODAL);
    setPasswordData(EMPTY_PASSWORDS);
    setShowPasswords(HIDDEN_PASSWORDS);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSavePassword = useCallback(async () => {
    try {
      await changePassword(changePasswordModal.userId, {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
        user_id: changePasswordModal.userId
      });
      showSuccess('Guardado', 'Contraseña actualizada');
      handleCloseChangePassword();
    } catch (error) {
      showRequestError('cambiar la contraseña', error);
    }
  }, [changePasswordModal.userId, passwordData, handleCloseChangePassword]);

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
