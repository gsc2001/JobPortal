import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6)
});
