import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useField } from 'formik';
import React from 'react';

interface FormikSelectFieldProps {
    formikKey: string;
    label: string;
    options: { value: string; label: string }[];
}
const FormikSelectField: React.FC<FormikSelectFieldProps> = ({
    formikKey,
    label,
    options
}) => {
    const [field, meta] = useField(formikKey);
    return (
        <FormControl
            variant="outlined"
            error={meta.touched && !!meta.error}
            style={{ width: '100%' }}
        >
            <InputLabel id={`${formikKey}-label`}>{label}</InputLabel>
            <Select
                name={formikKey}
                labelId={`${formikKey}-label`}
                value={field.value}
                onChange={field.onChange}
                label={label}
                error={meta.touched && !!meta.error}
            >
                {options.map((op, i) => (
                    <MenuItem value={op.value} key={i}>
                        {op.label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{meta.touched ? meta.error : ''}</FormHelperText>
        </FormControl>
    );
};

export default FormikSelectField;
