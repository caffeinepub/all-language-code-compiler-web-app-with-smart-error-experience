import { CompilerPage } from './pages/CompilerPage';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <CompilerPage />
      </div>
      <Toaster />
    </>
  );
}

export default App;
