import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTypedSelector } from '../../utils/hooks';
import ApplicantDashboard from './ApplicantDashboard';
import RecruiterDashboard from './RecruiterDashboard';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
    const role = useTypedSelector(state => state.auth.user.role);

    return (
        <div>
            {role === 'applicant' ? <ApplicantDashboard /> : <RecruiterDashboard />}
        </div>
    );
};

export default Dashboard;
