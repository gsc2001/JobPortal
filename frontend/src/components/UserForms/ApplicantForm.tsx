import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';

import { Formik, Form, FieldArray } from 'formik';

import { FormikTextField } from '../FormikTextField';
import ImageUploader from './ImageUploader';
import { ApplicantSchema, RegisterApplicantSchema } from './schemas';
import { randomNumber } from '../../utils';
import LoadingButton from '../LoadingButton';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../../store/alerts';
import { authReset } from '../../store/auth';
import { Applicant } from '../../utils/types';

interface RegisterApplicant extends Applicant {
    password: string;
    password2: string;
}

interface ApplicantFormProps {
    register: boolean;
    initialValues: RegisterApplicant | Applicant;
    onSubmit: (a: RegisterApplicant | Applicant) => Promise<any>;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    })
);
const colors = ['9c32ff', 'e000e0', '1447f0', '1fbe27', '02b3b3', '7961ff'];

const ApplicantForm: React.FC<ApplicantFormProps> = ({
    register,
    initialValues,
    onSubmit
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async a => {
                if (!a.avatarImage || a.avatarImage === '') {
                    a.avatarImage = `https://via.placeholder.com/280x200.png/${
                        colors[randomNumber(6)]
                    }/ffffff?text=${a.name.toUpperCase()[0]}`;
                }
                try {
                    await onSubmit(a);
                    return;
                } catch (err) {
                    console.error(err);
                    dispatch(authReset());
                    if (err.errors) {
                        err.errors.forEach((e: { msg: string }) =>
                            dispatch(pushAlert({ text: e.msg, type: 'error' }))
                        );
                    }
                }
            }}
            validationSchema={register ? RegisterApplicantSchema : ApplicantSchema}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                    <Box paddingY={1}>
                        <FormikTextField
                            formikKey="name"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            label="Name"
                            autoFocus
                        />
                        <FormikTextField
                            formikKey="email"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            disabled={!register}
                            label="Email Address"
                            autoComplete="email"
                        />
                        {register && (
                            <>
                                <FormikTextField
                                    formikKey="password"
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                                <FormikTextField
                                    formikKey="password2"
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                            </>
                        )}
                    </Box>

                    <Divider />
                    <Box paddingY={1}>
                        <Typography variant="h6"> Profile Picture </Typography>
                        <ImageUploader
                            onUploadDone={url => setFieldValue('avatarImage', url, false)}
                        />
                    </Box>
                    <Divider />
                    <Box paddingY={1}>
                        <Typography variant="h6"> Skills</Typography>
                        <Autocomplete
                            multiple
                            id="tags-filled"
                            value={values.skills}
                            options={['JS', 'Python', 'C++', 'C']}
                            freeSolo
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Languages"
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                />
                            )}
                            onChange={(e, value) => {
                                setFieldValue('skills', value);
                            }}
                        />
                    </Box>
                    <Divider />
                    <FieldArray
                        name="education"
                        render={arrayHelpers => (
                            <Box paddingY={1}>
                                <Typography variant="h6"> Education </Typography>
                                {values.education.map((_, index) => (
                                    <Box paddingY={1} key={index}>
                                        <Grid
                                            container
                                            spacing={0}
                                            justify="space-between"
                                        >
                                            <Grid item xs={12}>
                                                <FormikTextField
                                                    formikKey={`education.${index}.instituteName`}
                                                    variant="outlined"
                                                    margin="dense"
                                                    label="Institute Name"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <FormikTextField
                                                    formikKey={`education.${index}.startYear`}
                                                    variant="outlined"
                                                    margin="dense"
                                                    label="Start Year"
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <FormikTextField
                                                    formikKey={`education.${index}.endYear`}
                                                    variant="outlined"
                                                    margin="dense"
                                                    label="End Year"
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Button
                                                    onClick={() =>
                                                        arrayHelpers.insert(index + 1, {
                                                            instituteName: '',
                                                            startYear: '',
                                                            endYear: ''
                                                        })
                                                    }
                                                    color="secondary"
                                                >
                                                    Add
                                                </Button>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Button
                                                    onClick={() =>
                                                        arrayHelpers.remove(index)
                                                    }
                                                    color="secondary"
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    />
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        {register ? 'Register' : 'Save'}
                    </LoadingButton>
                </Form>
            )}
        </Formik>
    );
};

export default ApplicantForm;
