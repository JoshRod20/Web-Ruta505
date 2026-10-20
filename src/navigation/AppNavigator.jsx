import { BrowserRouter, Routes, Route } from 'react-router-dom';
import appRoutes from '../routes/appRoutes';

export default function AppNavigator() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}