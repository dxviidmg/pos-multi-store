import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
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
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} aria-label="Modo de importación">
        {MODES.map(({ label }, index) => (
          <Tab key={label} label={label} {...a11yProps(index)} />
        ))}
      </Tabs>
    </Box>
  );

  return MODES.map(({ label, Component }, index) => (
    <TabPanel key={label} value={value} index={index}>
      <Component tabs={tabs} />
    </TabPanel>
  ));
};

export default ProductImport;
