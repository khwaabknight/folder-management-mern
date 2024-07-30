import { TbLogout } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { resetUser, UserType } from '@/store/features/userSlice';
import { RootState } from '@/store/store';
import api from '@/utils/axiosConfig';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UserInfo() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state:RootState) => state.user)
    const {fullname, email} = user as UserType;

    const handleLogout = async () => {
        try {
          const response = await api.post('/api/v1/users/logout');
          console.log('Logout response: ', response);
          dispatch(resetUser());      
          navigate('/login');
          toast.success('Logged out successfully');
        } catch (error) {
          console.log('Error logging out: ', error);
          toast.error('Error logging out');
        }
    };

  return (
    <div className='border rounded-lg border-gray-300 bg-white flex justify-between items-center py-5 px-8 gap-3'>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 aspect-square overflow-hidden rounded-full">
            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${fullname}`} alt="" className="w-full" />
          </div>
          <div>
            <div> {fullname} </div>
            <div> {email} </div>
          </div>
        </div>
        <Button 
          type="button" 
          variant={'destructive'} 
          className="rounded-full aspect-square h-14 w-14 p-3"
          onClick={handleLogout}
        >
          <TbLogout size={24} className=" text-gray-300"/>
        </Button>
    </div>
  )
}

export default UserInfo