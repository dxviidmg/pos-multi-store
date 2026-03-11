import { Grid, TextField } from "@mui/material";
import CustomModal from "../Modal/Modal";
import CustomButton from "../Button/Button";

const EditUserModal = ({ open, onClose, userData, onChange, onSave }) => {
  return (
    <CustomModal showOut={open} onClose={onClose} title="Editar Usuario">
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Usuario"
                name="username"
                value={userData.username || ''}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="first_name"
                value={userData.first_name || ''}
                onChange={onChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Apellido"
                name="last_name"
                value={userData.last_name || ''}
                onChange={onChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={userData.email || ''}
                onChange={onChange}
                size="small"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton onClick={onSave} variant="contained" fullWidth>
                Guardar
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default EditUserModal;
