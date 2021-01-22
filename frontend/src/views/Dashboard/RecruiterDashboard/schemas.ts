import * as Yup from 'yup';
import moment from 'moment';

export const dateTimeFormat = 'YYYY-MM-DDThh:mm';

export const JobSchema = Yup.object().shape({
    name: Yup.string().required('Title of job is required'),
    applicationDeadline: Yup.date()
        .transform((value, originalValue) => {
            return moment(originalValue, dateTimeFormat).toDate();
        })
        .min(new Date(), 'Deadline should be after right now!'),
    maxPositions: Yup.number().required().min(1),
    maxApplications: Yup.number()
        .required()
        .min(
            (Yup.ref('maxPositions', {}) as unknown) as number,
            'Max applications should be greater than or equal to max positions'
        ),
    salary: Yup.number().required().min(1)
});

export const EditJobSchema = Yup.object().shape({
    applicationDeadline: Yup.date()
        .transform((value, originalValue) => {
            return moment(originalValue, dateTimeFormat).toDate();
        })
        .min(new Date(), 'Deadline should be after right now!'),
    maxPositions: Yup.number().required().min(1),
    maxApplications: Yup.number()
        .required()
        .min(
            (Yup.ref('maxPositions', {}) as unknown) as number,
            'Max applications should be greater than or equal to max positions'
        )
});
