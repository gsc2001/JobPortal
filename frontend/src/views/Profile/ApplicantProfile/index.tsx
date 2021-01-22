import React from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import userAPI from '../../../api/user';
import ApplicantForm from '../../../components/UserForms/ApplicantForm';
import { updateUser } from '../../../store/auth';
import { useTypedSelector } from '../../../utils/hooks';
import { Applicant } from '../../../utils/types';

interface ApplicantProfileProps {}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const { data, error, mutate } = useSWR(`get-self-${userId}`, () => userAPI.me());
    const dispatch = useDispatch();

    if (!data) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error!!</div>;
    }

    const user: Applicant = data.user;

    return (
        <div>
            <ApplicantForm
                initialValues={{
                    name: user.name,
                    email: user.email,
                    avatarImage: user.avatarImage,
                    role: 'applicant',
                    education: user.education,
                    skills: user.skills
                }}
                onSubmit={async a => {
                    const updateData = {
                        ...user,
                        ...a
                    };
                    const _res = await userAPI.updateMe(updateData);
                    const newUser = _res.user;
                    mutate({
                        user: {
                            name: newUser.name,
                            email: newUser.email,
                            avatarImage: newUser.avatarImage,
                            role: 'applicant',
                            education: newUser.education,
                            skills: newUser.skills
                        }
                    });
                    dispatch(
                        updateUser({
                            id: newUser._id,
                            avatarImage: newUser.avatarImage,
                            name: newUser.name,
                            email: newUser.email,
                            role: 'applicant'
                        })
                    );
                }}
                register={false}
            />
        </div>
    );
};

export default ApplicantProfile;
