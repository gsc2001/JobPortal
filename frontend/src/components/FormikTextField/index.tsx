import React from 'react';
import { useField } from 'formik';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
// import { TextField, TextFieldProps } from '@material-ui/core';

type FormikTextFieldProps = {
    formikKey: string;
} & TextFieldProps;

export const FormikTextField: React.FC<FormikTextFieldProps> = ({
    formikKey,
    ...props
}) => {
    const [field, meta, helpers] = useField(formikKey);
    return (
        <TextField
            id={field.name}
            name={field.name}
            helperText={meta.touched ? meta.error : ''}
            error={meta.touched && Boolean(meta.error)}
            value={field.value}
            onChange={field.onChange}
            {...props}
        />
    );
};
