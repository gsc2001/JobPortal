import * as Yup from 'yup';

const ApplicantBase = {
    name: Yup.string().required('Name is required'),
    email: Yup.string().required().email(),
    education: Yup.array().of(
        Yup.object().shape({
            instituteName: Yup.string().required('Institute Name is required!'),
            startYear: Yup.string().required('Start Year is required'),
            endYear: Yup.string()
        })
    )
};

const RecruiterBase = {
    name: Yup.string().required('Name is required'),
    email: Yup.string().required().email(),
    bio: Yup.string()
        .required()
        .test('word-count', 'Number of words should be < 250', function (value) {
            if (!value) {
                return true;
            }
            if (value.split(' ').length > 250) {
                // no of words > 250
                return false;
            }
            return true;
        }),
    contactNumber: Yup.string()
        .required()
        .matches(/^\d{10}$/, 'Not a valid phone number')
};

const PasswordChecker = {
    password: Yup.string().required().min(6),
    password2: Yup.string().when('password', {
        is: undefined,
        then: Yup.string().notRequired(),
        otherwise: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], "Passwords don't match! ")
    })
};

export const RegisterApplicantSchema = Yup.object().shape({
    ...ApplicantBase,
    ...PasswordChecker
});

export const ApplicantSchema = Yup.object().shape({
    ...ApplicantBase
});

export const RegisterRecruiterSchema = Yup.object().shape({
    ...RecruiterBase,
    ...PasswordChecker
});

export const RecruiterSchema = Yup.object().shape({
    ...RecruiterBase
});
