import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTypedSelector } from '../../utils/hooks';
import ApplicantApplications from './ApplicantApplications';
import RecruiterApplications from './RecruiterApplications';

interface ApplicationProps {}

const Application: React.FC<ApplicationProps> = ({}) => {
    const role = useTypedSelector(state => state.auth.user.role);
    return (
        <div>
            {role === 'applicant' ? <ApplicantApplications /> : <RecruiterApplications />}
        </div>
    );
};

export default Application;
