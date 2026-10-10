import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const ProfileSectionTitle = ({ icon: Icon, title }) => (
  <>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Icon sx={{ mr: 1 }} />
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Divider sx={{ mb: 2 }} />
  </>
);

export default ProfileSectionTitle;
