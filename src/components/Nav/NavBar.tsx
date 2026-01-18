import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthContext';

export function NavBar() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se o usuário está na página de pets ou tutores
  const isInPetsSection = location.pathname.startsWith('/pets');
  const isInTutorsSection = location.pathname.startsWith('/tutores');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="navbar navbar-dark bg-primary py-4" expand="lg">
      <Container>
        <Navbar.Brand>
          <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="currentColor">
            <g>
              <path d="M22.58 0.72c-0.28 0.03-0.54 0.17-0.72 0.39l-4.53 5.61c0.61 0.35 1.17 0.77 1.69 1.24 0.91 0.83 1.63 1.81 2.13 2.89 0.24 0.51 0.42 1.04 0.55 1.58 2.82-3.59 2.41-8.68 2.07-10.82-0.09-0.59-0.61-0.99-1.19-0.89z"/>
              <path d="M20.88 14.43c0-0.37-0.03-0.74-0.08-1.09-0.36-2.48-1.94-4.6-4.17-5.85-1.35-0.76-2.93-1.19-4.63-1.19-1.67 0-3.27 0.44-4.62 1.19-2.23 1.25-3.8 3.37-4.16 5.85-0.05 0.36-0.08 0.72-0.08 1.09 0 2.92 1.68 5.59 4.21 7.1-0.03-0.18-0.04-0.36-0.04-0.56 0-0.59 0.13-1.17 0.39-1.71 0.24-0.51 0.59-0.97 1.03-1.37 0.89-0.79 2.05-1.22 3.29-1.22 1.24 0 2.41 0.43 3.3 1.22 0.44 0.39 0.79 0.85 1.03 1.37 0.26 0.54 0.39 1.12 0.39 1.71 0 0.19-0.01 0.38-0.04 0.56 2.53-1.51 4.21-4.18 4.21-7.1zM5.71 11.02c0.02-0.26 0.25-0.46 0.51-0.45l2.3.15c0.26 0.02 0.46 0.25 0.45 0.51-0.02 0.25-0.23 0.45-0.48 0.45l-2.3-0.15c-0.26-0.02-0.46-0.25-0.45-0.51zm1.64 5.44c-1.12 0-2.02-0.91-2.02-2.02s0.91-2.02 2.02-2.02c1.12 0 2.02 0.91 2.02 2.02s-0.9 2.02-2.02 2.02zm8.12-5.73l2.3-0.15c0.26-0.02 0.49 0.18 0.51 0.45 0.02 0.26-0.18 0.49-0.45 0.51l-2.3 0.15c-0.25 0-0.46-0.19-0.48-0.45-0.02-0.26 0.17-0.48 0.42-0.51zm1.17 5.73c-1.12 0-2.02-0.91-2.02-2.02s0.91-2.02 2.02-2.02c1.12 0 2.02 0.91 2.02 2.02s-0.9 2.02-2.02 2.02z"/>
              <path d="M15.45 22.15c0.21-0.31 0.32-0.69 0.32-1.17 0-0.74-0.28-1.45-0.76-2.01-0.5-0.59-1.19-1-1.93-1.19-0.35-0.09-0.71-0.14-1.06-0.14-0.55 0-1.11 0.1-1.61 0.31-0.7 0.29-1.32 0.78-1.72 1.42-0.3 0.48-0.46 1.04-0.46 1.61 0 0.48 0.11 0.86 0.32 1.17 0.58 0.88 1.9 1.12 3.43 1.12 1.54 0 2.86-0.24 3.44-1.12zm-3.44-1.23c-0.83 0-1.49-0.56-1.49-1.25 0-0.36 0.19-0.69 0.46-0.91 0.65-0.52 1.77-0.46 2.31 0.21 0.16 0.2 0.25 0.44 0.25 0.7 0 0.69-0.67 1.25-1.5 1.25z"/>
              <path d="M4.99 7.97c0.52-0.47 1.08-0.89 1.69-1.24L2.15 1.12c-0.18-0.22-0.44-0.36-0.72-0.39-0.57-0.06-1.1 0.34-1.19 0.91-0.34 2.14-0.76 7.23 2.07 10.82 0.13-0.54 0.31-1.07 0.55-1.58 0.5-1.08 1.22-2.06 2.13-2.89z"/>
            </g>
          </svg>

        </Navbar.Brand>
        <Navbar.Brand as={Link} to="/" title="MEU PET">MEU PET</Navbar.Brand>  {/* Usando Link para navegação interna */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Menu Pets */}
            <NavDropdown title="Pets" id="pets-dropdown" active={isInPetsSection}>
              <NavDropdown.Item as={Link} to="/">Listagem</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pets/novo">Cadastrar Pet</NavDropdown.Item>
            </NavDropdown>

            {/* Menu Tutores */}
            <NavDropdown title="Tutores" id="tutors-dropdown" active={isInTutorsSection}>
              <NavDropdown.Item as={Link} to="/tutores">Listagem</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tutores/novo">Cadastrar Tutor</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown title={userName} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
