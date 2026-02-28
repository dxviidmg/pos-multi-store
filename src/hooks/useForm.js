import { useState } from 'react';

/**
 * Hook para manejar formularios de forma simple
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @returns {Object} - { values, handleChange, reset, setValues, setValue }
 * 
 * @example
 * const { values, handleChange, reset } = useForm({ name: "", email: "" });
 * 
 * <input name="name" value={values.name} onChange={handleChange} />
 * <button onClick={reset}>Limpiar</button>
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    reset,
    setValues,
    setValue
  };
};
