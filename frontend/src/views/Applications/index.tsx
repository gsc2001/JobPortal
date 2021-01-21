import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTypedSelector } from '../../utils/hooks';
import ApplicantApplications from './ApplicantApplications';

interface ApplicationProps {}

const Application: React.FC<ApplicationProps> = ({}) => {
    const role = useTypedSelector(state => state.auth.user.role);
    return <div>{role === 'applicant' && <ApplicantApplications />}</div>;
};

export default Application;
