import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router';

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#13131f',
            color: '#fff',
            border: '1px solid rgba(99,102,241,0.3)',
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
}
