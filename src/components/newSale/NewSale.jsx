import React from 'react'
import SearchClient from '../searchClient/SearchClient'
import SearchProduct from '../searchProduct/SearchProduct'
import Cart from '../cart/Cart'
import ClientSelected from '../clientSelected/ClientSelected'
import { Container } from 'react-bootstrap'

const NewSale = () => {
  return (
    <Container>
        <SearchClient></SearchClient>
        <ClientSelected></ClientSelected>
        <SearchProduct></SearchProduct>
        <Cart></Cart>      
    </Container>
  )
}

export default NewSale
