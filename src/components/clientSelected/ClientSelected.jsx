import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const ClientSelected = () => {

  const s = useSelector((state) => state.clientSelectedReducer.client);

  
  return (
    <div>
      <h1>Cliente seleccionado</h1>
      { s ? s.full_name : 'No data' }


    </div>
  )
}

export default ClientSelected
