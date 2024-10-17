import React, { useEffect, useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { getSpecialClients } from '../../apis/specialClients';
import CustomTable from '../../commons/customTable';


const SearchableSelect = () => {
    const [options, setOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          const response2 = await getSpecialClients();
    
          setOptions(response2.data);
          console.log(response2.data);
        };
    
        fetchData();
      }, []);

    const filteredOptions = options.filter(option =>
        option.first_name.toLowerCase().includes(searchTerm.toLowerCase()) // Asegúrate de ajustar esto según la estructura de tus opciones
    );

    const handleSelect = (option) => {
        setSelectedOption(option.first_name); // Ajusta esto según la estructura de tus opciones
        setSearchTerm('');
    };

    return (
        <div>
            <CustomTable
              inputPlaceholder="Buscar fichas"
              title="Últimas fichas"
              data={options}
              columns={[

                {
                  name: "Arete",
                  selector: (row) => row.first_name,
                  sortable: true,
                },

              ]}
            ></CustomTable>
        </div>
    );
};

export default SearchableSelect;
