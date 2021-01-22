import React from 'react';
import { useDispatch } from 'react-redux';
import useSWR, { mutate } from 'swr';
import userAPI from '../../../api/user';
import RecruiterForm from '../../../components/UserForms/RecruiterForm';
import { updateUser } from '../../../store/auth';
import { useTypedSelector } from '../../../utils/hooks';

interface RecruiterProfileProps {}

const RecruiterProfile: React.FC<RecruiterProfileProps> = ({}) => {
    const userId = useTypedSelector(state => state.auth.user.id);
    const { data, error, mutate } = useSWR(`get-self-${userId}`, () => userAPI.me());
    const dispatch = useDispatch();

    if (!data) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error!!</div>;
    }

    const user = data.user;

    return (
        <div>
            <RecruiterForm
                initialValues={{
                    name: user.name,
                    email: user.email,
                    avatarImage: user.avatarImage,
                    role: 'recruiter',
                    bio: user.bio,
                    contactNumber: user.contactNumber
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
                            role: 'recruiter',
                            bio: newUser.bio,
                            contactNumber: newUser.contactNumber
                        }
                    });
                    dispatch(
                        updateUser({
                            id: newUser._id,
                            avatarImage: newUser.avatarImage,
                            name: newUser.name,
                            email: newUser.email,
                            role: 'recruiter'
                        })
                    );
                }}
                register={false}
            />
        </div>
    );
};

export default RecruiterProfile;
