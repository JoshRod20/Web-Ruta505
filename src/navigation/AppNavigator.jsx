import { BrowserRouter, Routes, Route } from 'react-router-dom';
import appRoutes from '../routes/appRoutes';

const renderRoutes = (routes) =>
  routes.map(({ path, element, children }, index) => (
    <Route key={path ?? `layout-${index}`} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));

export default function AppNavigator() {
  return (
    <BrowserRouter>
      <Routes>{renderRoutes(appRoutes)}</Routes>
    </BrowserRouter>
  );
}