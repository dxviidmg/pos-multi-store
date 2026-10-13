import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TraditionalImport from "./TraditionalImport";
import EleventaImport from "./EleventaImport";

const MODES = [
  { label: "Tradicional", Component: TraditionalImport },
  { label: "Especial", Component: EleventaImport },
];

const a11yProps = (index) => ({
  id: `import-tab-${index}`,
  "aria-controls": `import-tabpanel-${index}`,
});

const TabPanel = ({ value, index, children }) => (
  <div role="tabpanel" hidden={value !== index} id={`import-tabpanel-${index}`} aria-labelledby={`import-tab-${index}`}>
    {value === index && children}
  </div>
);

const ProductImport = () => {
  const [value, setValue] = useState(0);

  const tabs = (
    <ToggleButtonGroup
      value={value}
      exclusive
      fullWidth
      size="small"
      color="primary"
      onChange={(event, newValue) => newValue !== null && setValue(newValue)}
      aria-label="Modo de importación"
      sx={{ mb: 2 }}
    >
      {MODES.map(({ label }, index) => (
        <ToggleButton key={label} value={index} {...a11yProps(index)}>{label}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  return MODES.map(({ label, Component }, index) => (
    <TabPanel key={label} value={value} index={index}>
      <Component tabs={tabs} />
    </TabPanel>
  ));
};

export default ProductImport;
