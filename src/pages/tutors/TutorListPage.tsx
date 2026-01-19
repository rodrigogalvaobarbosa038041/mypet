import { NavBar } from '../../components/Nav/NavBar';
import { useListPage } from '../../hooks/useListPage';
import { Button, Col, Row, InputGroup, Form } from 'react-bootstrap';
import { Pagination } from '../../components/Pagination/Pagination';
import { CardTutor } from '../../components/Cards/CardTutor';
import { useNavigate } from 'react-router-dom';
import { ITutor } from '../../types';

export default function TutorListPage() {
  const navigate = useNavigate();
  
  const {
    currentData,
    dataPerPage,
    currentPage,
    searchTerm,
    loading,
    totalCount,
    setCurrentPage,
    setSearchTerm,
  } = useListPage<ITutor>('v1/tutores');

  // Calcular total de dados para paginação (considerando filtro)
  const totalFilteredData = searchTerm ? currentData.length : totalCount;

  // Navegar para detalhes do tutor
  const verDetalhes = (tutorId: number) => {
    navigate(`/tutores/${tutorId}`);
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Listagem de Tutores</h3>
          <Button 
            variant="primary" 
            onClick={() => navigate('/tutores/novo')}
          >
            + Cadastrar Novo Tutor
          </Button>
        </div>
        
        {/* Barra de busca */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Cards de tutores */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : currentData.length > 0 ? (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {currentData.map(tutor => (
              <Col key={tutor.id}>
                <CardTutor 
                  tutor={tutor}
                  onClick={verDetalhes}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center my-5">
            <p className="text-muted">
              {searchTerm 
                ? 'Nenhum tutor encontrado com este nome.' 
                : totalCount === 0 
                  ? 'Nenhum tutor cadastrado.' 
                  : 'Nenhum tutor disponível.'
              }
            </p>
          </div>
        )}

        {/* Paginação */}
        {totalFilteredData > dataPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              dataPerPage={dataPerPage}
              totalData={totalFilteredData}
              paginate={setCurrentPage}
            />
          </div>
        )}
        
        {/* Informações de paginação */}
        {currentData.length > 0 && (
          <div className="text-center mt-2 text-muted">
            {searchTerm 
              ? `Mostrando ${Math.min(currentData.length, dataPerPage)} de ${currentData.length} tutores encontrados para "${searchTerm}" (Página ${currentPage + 1} de ${Math.ceil(currentData.length / dataPerPage)})`
              : `Mostrando ${Math.min(currentData.length, dataPerPage)} de ${totalFilteredData} tutores (Página ${currentPage + 1} de ${Math.ceil(totalFilteredData / dataPerPage)})`
            }
          </div>
        )}
      </div>
    </>
  );
}
