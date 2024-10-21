import React from 'react'
import SearchClient from '../searchClient/SearchClient'
import SearchProduct from '../searchProduct/SearchProduct'
import Cart from '../cart/Cart'

const NewSale = () => {
  return (
    <div>
        <SearchClient></SearchClient>
        <SearchProduct></SearchProduct>
        <Cart></Cart>      
    </div>
  )
}

export default NewSale
