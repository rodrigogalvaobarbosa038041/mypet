import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoginPage } from '../pages/auth/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivateRoute } from './PrivateRoute';

// Lazy loading para componentes de Pets
const PetListPage = lazy(() => import('../pages/pets/PetListPage'));
const PetDetailPage = lazy(() => import('../pages/pets/PetDetailPage'));
const PetFormPage = lazy(() => import('../pages/pets/PetFormPage'));

// Lazy loading para componentes de Tutores
const TutorListPage = lazy(() => import('../pages/tutors/TutorListPage'));
const TutorDetailPage = lazy(() => import('../pages/tutors/TutorDetailPage'));
const TutorFormPage = lazy(() => import('../pages/tutors/TutorFormPage'));

// Componente de loading
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '16rem' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Carregando...</span>
    </div>
  </div>
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <PetListPage />
            </Suspense>
          } path="/" />
        }
      />
      <Route
        path="/pets/:id"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <PetDetailPage />
            </Suspense>
          } path="/pets/:id" />
        }
      />
      <Route
        path="/pets/novo"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <PetFormPage />
            </Suspense>
          } path="/pets/novo" />
        }
      />
      <Route
        path="/pets/:id/editar"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <PetFormPage />
            </Suspense>
          } path="/pets/:id/editar" />
        }
      />
      <Route
        path="/tutores"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <TutorListPage />
            </Suspense>
          } path="/tutores" />
        }
      />
      <Route
        path="/tutores/:id"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <TutorDetailPage />
            </Suspense>
          } path="/tutores/:id" />
        }
      />
      <Route
        path="/tutores/novo"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <TutorFormPage />
            </Suspense>
          } path="/tutores/novo" />
        }
      />
      <Route
        path="/tutores/:id/editar"
        element={
          <PrivateRoute element={
            <Suspense fallback={<LoadingSpinner />}>
              <TutorFormPage />
            </Suspense>
          } path="/tutores/:id/editar" />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
