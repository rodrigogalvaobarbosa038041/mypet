import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/Nav/NavBar';
import { Api } from '../../providers/Api';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { IPet, ITutor } from '../../types';
import { showError, showSuccess, devLog } from '../../utils/errorHandler';

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pet, setPet] = useState<IPet | null>(null);
  const [tutores, setTutores] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar detalhes do pet
  const petGet = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await Api.get(`v1/pets/${id}`);
      setPet(response.data);
      
      // Se houver tutores, definir os dados dos tutores
      if (response.data.tutores && response.data.tutores.length > 0) {
        setTutores(response.data.tutores);
      }
    } catch (error) {
      devLog('Erro ao buscar detalhes do pet', error);
      setError('Não foi possível carregar os detalhes do pet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    petGet();
  }, [id]);

  const voltar = () => {
    navigate('/');
  };

  const editar = () => {
    if (pet?.id) {
      navigate(`/pets/${pet.id}/editar`);
    }
  };

  const excluir = async () => {
    if (!pet?.id) return;
    
    if (!window.confirm('Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await Api.delete(`v1/pets/${pet.id}`);
      showSuccess('Pet excluído com sucesso!');
      navigate('/');
    } catch (error) {
      devLog('Erro ao excluir pet', error);
      showError('Erro ao excluir pet. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container">
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        </div>
      </>
    );
  }

  if (error || !pet) {
    return (
      <>
        <NavBar />
        <div className="container">
          <Alert variant="danger" className="my-4">
            {error || 'Pet não encontrado.'}
          </Alert>
          <Button variant="secondary" onClick={voltar}>
            Voltar para Listagem
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Detalhes do Pet</h2>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={editar}>
              ✏️ Editar
            </Button>
            <Button variant="danger" onClick={excluir}>
              🗑️ Excluir
            </Button>
            <Button variant="secondary" onClick={voltar}>
              ← Voltar
            </Button>
          </div>
        </div>

        <Row>
          {/* Foto do Pet */}
          <Col md={4} className="mb-4">
            <Card className="h-100">
              {pet.foto?.url ? (
                <Card.Img 
                  variant="top" 
                  src={pet.foto.url} 
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '300px' }}
                >
                  <span className="text-muted">Sem foto</span>
                </div>
              )}
            </Card>
          </Col>

          {/* Informações do Pet */}
          <Col md={8}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title as="h2" className="text-primary mb-4">
                  {pet.nome}
                </Card.Title>
                
                <Row className="mb-3">
                  <Col sm={6} className="mb-2">
                    <strong>Raça:</strong> {pet.raca}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Idade:</strong> {pet.idade !== null && pet.idade !== undefined ? `${pet.idade} ${pet.idade === 1 ? 'ano' : 'anos'}` : 'Não informada'}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={12} className="mb-2">
                    <strong>Informações Adicionais:</strong> Pet saudável e vacinado
                  </Col>
                </Row>

                {/* Informações dos Tutores */}
                {tutores.length > 0 ? (
                  <div className="mt-4 p-3 bg-light rounded">
                    <h4 className="text-success mb-3">
                      <span className="me-2">👤</span>
                      Dados do{tutores.length > 1 ? 's' : ''} Tutor{tutores.length > 1 ? 'es' : ''}
                    </h4>
                    {tutores.map((tutor, index) => (
                      <div key={tutor.id} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                        <Row>
                          <Col sm={12} className="mb-3">
                            <div className="d-flex align-items-center">
                              <strong className="me-2">Nome:</strong>
                              <span>{tutor.nome}</span>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="ms-auto"
                                onClick={() => navigate(`/tutores/${tutor.id}`)}
                              >
                                Ver Detalhes do Tutor
                              </Button>
                            </div>
                          </Col>
                          <Col sm={6} className="mb-2">
                            <strong>Email:</strong> {tutor.email || 'Não informado'}
                          </Col>
                          <Col sm={6} className="mb-2">
                            <strong>Telefone:</strong> {tutor.telefone || 'Não informado'}
                          </Col>
                          <Col sm={12} className="mb-2">
                            <strong>Endereço:</strong> {tutor.endereco || 'Não informado'}
                          </Col>
                          <Col sm={6} className="mb-2">
                            <strong>CPF:</strong> {tutor.cpf || 'Não informado'}
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted my-3">
                    <span className="me-2">⚠️</span>
                    Este pet ainda não possui tutor(es) vinculado(s).
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
