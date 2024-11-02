import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Cart from './Cart';
import TransferList from '../transferList/TransferList';



import { useState } from "react";

function TabCart() {
  const [activeTab, setActiveTab] = useState("compra-actual");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (key) => {
    setActiveTab(key);
    if (key === "traspasos") {
      setRefreshKey((prevKey) => prevKey + 1); // Cambia refreshKey para forzar la actualización
    }
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={handleSelect}
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="compra-actual" title="Compra actual">
        <Cart />
      </Tab>
      <Tab eventKey="traspasos" title="Traspasos">
        <TransferList key={refreshKey} /> {/* key cambia cada vez que se selecciona */}
      </Tab>
    </Tabs>
  );
}

export default TabCart;


