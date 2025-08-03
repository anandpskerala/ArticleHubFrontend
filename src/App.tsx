import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/useAppDispatch';
import { verifyUser } from './store/actions/auth/verifyUser';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
  )
}

export default App