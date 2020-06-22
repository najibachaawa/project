import { FieldProps } from 'formik'
import React from 'react'
import Select, { Option, ReactSelectProps } from 'react-select'

const SelectField = ({
  options,
  field,
  form,
}) => (
  <Select
    options={options}
    name={field.name}
    className="react-select"
    classNamePrefix="react-select"
    value={options ? options.find(option => option.value === field.value) : ''}
    onChange={(option) => form.setFieldValue(field.name, option.value)}
    onBlur={field.onBlur}
  />
)

export default SelectField;