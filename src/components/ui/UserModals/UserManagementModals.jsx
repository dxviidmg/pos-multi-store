import React from "react";
import EditUserModal from "./EditUserModal";
import ChangePasswordModal from "./ChangePasswordModal";

/**
 * Modales "Editar usuario" y "Cambiar contraseña" conectados al resultado de
 * `useUserManagement()`. La página solo abre con `handleOpenEditUser(id)` /
 * `handleOpenChangePassword(id)`.
 */
const UserManagementModals = ({ management }) => {
  const {
    editUserModal,
    changePasswordModal,
    passwordData,
    showPasswords,
    handleCloseEditUser,
    handleEditUserChange,
    handleSaveUser,
    handleCloseChangePassword,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSavePassword,
  } = management;

  return (
    <>
      <EditUserModal
        open={editUserModal.open}
        onClose={handleCloseEditUser}
        userData={editUserModal.data}
        onChange={handleEditUserChange}
        onSave={handleSaveUser}
      />
      <ChangePasswordModal
        open={changePasswordModal.open}
        onClose={handleCloseChangePassword}
        passwordData={passwordData}
        onChange={handlePasswordChange}
        onSave={handleSavePassword}
        showPasswords={showPasswords}
        onToggleVisibility={togglePasswordVisibility}
      />
    </>
  );
};

export default UserManagementModals;
