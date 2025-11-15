import { Container, CssBaseline } from '@mui/material';
import { AppProvider } from './AppProvider';
import AutocompleteTabs from './components/Tabs';

const App = () => {
  return (
    <AppProvider>
      <CssBaseline />
      <Container sx={{ padding: '16px' }} maxWidth="lg">
        <AutocompleteTabs />
      </Container>
    </AppProvider>
  );
};

export default App;
