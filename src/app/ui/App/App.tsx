import { Header, LinearProgress } from '@/common/components';
import { Routing } from '@/common/routing';
import s from './App.module.css';
import { ToastContainer } from 'react-toastify';
import { useGlobalLoading } from '@/common/hooks';

export const App = () => {
  const isGlobalLoading = useGlobalLoading();

  return (
    <>
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
