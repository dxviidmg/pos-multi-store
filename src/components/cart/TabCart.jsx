import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Cart from './Cart';
import TransferList from '../transferList/TransferList';


import { useState } from "react";
import { useSelector } from 'react-redux';

function TabCart() {
  const [activeTab, setActiveTab] = useState("venta-actual");
  const [refreshKey, setRefreshKey] = useState(0);
  const movementType = useSelector((state) => state.cartReducer.movementType);

  const handleSelect = (key) => {
    setActiveTab(key);
    if (key === "traspasos") {
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div style={{minHeight: '45vh'}}>
    <Tabs
      activeKey={activeTab}
      onSelect={handleSelect}
      id="justify-tab-example"
      className="mb-3"
      justify

    >
      <Tab eventKey="venta-actual" title={movementType.charAt(0).toUpperCase() + movementType.slice(1) + " actual"} >
        <Cart />
      </Tab>
      <Tab eventKey="traspasos" title="Traspasos pendientes">
        <TransferList key={refreshKey} /> {/* key cambia cada vez que se selecciona */}
      </Tab>
    </Tabs>
    </div>
  );
}

export default TabCart;


