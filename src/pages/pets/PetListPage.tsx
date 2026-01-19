import { NavBar } from '../../components/Nav/NavBar';
import { useListPage } from '../../hooks/useListPage';
import { Button, Col, Row, InputGroup, Form } from 'react-bootstrap';
import { Pagination } from '../../components/Pagination/Pagination';
import { CardPet } from '../../components/Cards/CardPet';
import { useNavigate } from 'react-router-dom';
import { IPet } from '../../types';

export default function PetListPage() {
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
  } = useListPage<IPet>('v1/pets');

  // Calcular total de dados para paginação (considerando filtro)
  const totalFilteredData = searchTerm ? currentData.length : totalCount;

  // Navegar para detalhes do pet
  const verDetalhes = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Listagem de Pets</h3>
          <Button 
            variant="primary" 
            onClick={() => navigate('/pets/novo')}
          >
            + Cadastrar Novo Pet
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

        {/* Cards de pets */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : currentData.length > 0 ? (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {currentData.map(pet => (
              <Col key={pet.id}>
                <CardPet 
                  pet={pet}
                  onClick={verDetalhes}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center my-5">
            <p className="text-muted">
              {searchTerm 
                ? 'Nenhum pet encontrado com este nome.' 
                : totalCount === 0 
                  ? 'Nenhum pet cadastrado.' 
                  : 'Nenhum pet disponível.'
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
              ? `Mostrando ${Math.min(currentData.length, dataPerPage)} de ${currentData.length} pets encontrados para "${searchTerm}" (Página ${currentPage + 1} de ${Math.ceil(currentData.length / dataPerPage)})`
              : `Mostrando ${Math.min(currentData.length, dataPerPage)} de ${totalFilteredData} pets (Página ${currentPage + 1} de ${Math.ceil(totalFilteredData / dataPerPage)})`
            }
          </div>
        )}
      </div>
    </>
  );
}
