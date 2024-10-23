import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import SearchClient from '../searchClient/SearchClient';
import Searcher from '../commons/searcher/Searcher';
import { Form } from 'react-bootstrap';

const ClientSelected = () => {

  const s = useSelector((state) => state.clientSelectedReducer.client);

  
  return (

      <Form.Control
        type="text"
        value={ s ? s.full_name + s.discount: 'No data' }
        placeholder=""
      />
  )
}

export default ClientSelected
