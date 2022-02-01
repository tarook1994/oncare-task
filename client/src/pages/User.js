import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// material
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
// components
import axios from 'axios';
import Page from '../components/Page';
import { checkAccessAndRefreshTokensValidity, getToken } from '../utils/tokenUtils';
import UsersTable from '../components/_dashboard/app/users/UsersTable';

// ----------------------------------------------------------------------

export default function Vehicles() {
  const [isTokenCheckInProgress, setIsTokenCheckInProgress] = useState(true);
  const navigate = useNavigate();

  const refreshTokens = async () => {
    try {
      const refreshTokenResponse = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BASE_BACKEND_URL}/refresh-tokens`,
        headers: { Authorization: getToken('refresh-token') }
      });
      const { refreshToken, accessToken } = refreshTokenResponse.data;
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('refresh-token', refreshToken);
      return setIsTokenCheckInProgress(false);
    } catch (error) {
      return navigate('/login', { replace: true });
    }
  };
  useEffect(() => {
    try {
      const tokenValidity = checkAccessAndRefreshTokensValidity();
      if (tokenValidity === 'refresh-access') {
        return refreshTokens();
      }
      if (tokenValidity === 'proceed') {
        return setIsTokenCheckInProgress(false);
      }
      return navigate('/login', { replace: true });
    } catch (error) {
      console.log(error);
      return navigate('/login', { replace: true });
    }
  }, []);

  useEffect(() => {
    if (!isTokenCheckInProgress) {
      setIsTokenCheckInProgress(false);
    }
  }, [isTokenCheckInProgress]);

  return (
    <Page title="Users | Rabbit Express">
      {isTokenCheckInProgress ? (
        <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress color="primary" />
        </Backdrop>
      ) : (
        <UsersTable />
      )}
    </Page>
  );
}
