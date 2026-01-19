import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/Nav/NavBar';
import { Api } from '../../providers/Api';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Card, Spinner, Alert, ListGroup, Form } from 'react-bootstrap';
import { ITutor, IPet } from '../../types';
import { showError, showSuccess, devLog } from '../../utils/errorHandler';

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState<ITutor | null>(null);
  const [pets, setPets] = useState<IPet[]>([]);
  const [availablePets, setAvailablePets] = useState<IPet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingAvailablePets, setLoadingAvailablePets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do tutor e pets vinculados
  const loadTutor = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await Api.get(`v1/tutores/${id}`);
      setTutor(response.data);
      
      // Usar pets já retornados na resposta principal
      if (response.data.pets && response.data.pets.length > 0) {
        setPets(response.data.pets);
      }
    } catch (error) {
      setError('Não foi possível carregar os dados do tutor.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar pets vinculados ao tutor (mantido para compatibilidade)
  const loadPetsVinculados = async () => {
    // Não é mais necessário, pois os pets já vêm na resposta principal
    // Mantido apenas para compatibilidade com código existente
  };

  // Buscar todos os pets disponíveis para vinculação
  const loadAvailablePets = async () => {
    setLoadingAvailablePets(true);
    try {
      // Buscar primeira página para saber o total
      const firstPageResponse = await Api.get('v1/pets?page=0&size=100');
      const firstPageData = firstPageResponse.data;
      const allPets = firstPageData?.content || [];
      
      // Se houver mais páginas, buscar todas
      if (firstPageData?.pageCount > 1) {
        for (let page = 1; page < firstPageData.pageCount; page++) {
          const pageResponse = await Api.get(`v1/pets?page=${page}&size=100`);
          const pagePets = pageResponse.data?.content || [];
          allPets.push(...pagePets);
        }
      }
      
      // Filtrar pets que já estão vinculados
      const petIdsVinculados = pets.map((pet: IPet) => pet.id);
      const petsDisponiveis = allPets.filter((pet: IPet) => !petIdsVinculados.includes(pet.id));
      
      setAvailablePets(petsDisponiveis);
    } catch (error) {
      setAvailablePets([]);
    } finally {
      setLoadingAvailablePets(false);
    }
  };

  useEffect(() => {
    loadTutor();
  }, [id]);

  useEffect(() => {
    // Carregar pets disponíveis apenas quando o tutor for carregado
    if (id && !loading) {
      loadAvailablePets();
    }
  }, [id, loading]);

  // Vincular pet ao tutor
  const vincularPet = async (petId: any) => {
    if (!id) return;
    
    try {
      devLog('Vinculando pet', { petId, tutorId: id });
      
      const response = await Api.post(`v1/tutores/${id}/pets/${petId}`);
      devLog('Resposta da API (vinculação)', response);
      
      // Adicionar pet manualmente à lista
      const petVinculado = availablePets.find((pet: IPet) => pet.id === parseInt(petId));
      
      if (petVinculado) {
        const novaLista = [...pets, petVinculado];
        setPets(novaLista);
        
        // Remover pet da lista de disponíveis
        const novaListaDisponiveis = availablePets.filter((pet: IPet) => pet.id !== parseInt(petId));
        setAvailablePets(novaListaDisponiveis);
      }
    } catch (error: any) {
      devLog('Erro ao vincular pet', error);
      setError('Erro ao vincular pet.');
    }
  };

  // Remover vínculo do pet
  const removerVinculo = async (petId: any) => {
    if (!id) return;
    
    if (!window.confirm('Tem certeza que deseja remover este vínculo?')) {
      return;
    }
    
    try {
      devLog('Removendo vínculo', { petId, tutorId: id });
      
      await Api.delete(`v1/tutores/${id}/pets/${petId}`);
      devLog('Vínculo removido com sucesso');
      
      // Remover pet manualmente da lista
      const novaLista = pets.filter((pet: IPet) => pet.id !== parseInt(petId));
      setPets(novaLista);
      
      // Adicionar pet de volta à lista de disponíveis
      const petRemovido = pets.find((pet: IPet) => pet.id === parseInt(petId));
      if (petRemovido) {
        const novaListaDisponiveis = [...availablePets, petRemovido];
        setAvailablePets(novaListaDisponiveis);
      }
    } catch (error) {
      devLog('Erro ao remover vínculo', error);
      setError('Erro ao remover vínculo.');
    }
  };

  const voltar = () => {
    navigate('/tutores');
  };

  const editar = () => {
    if (id) {
      navigate(`/tutores/${id}/editar`);
    }
  };

  const excluir = async () => {
    if (!id) return;
    
    if (!window.confirm('Tem certeza que deseja excluir este tutor? Esta ação não pode ser desfeita e também excluirá todos os vínculos com pets.')) {
      return;
    }
    
    try {
      await Api.delete(`v1/tutores/${id}`);
      showSuccess('Tutor excluído com sucesso!');
      navigate('/tutores');
    } catch (error) {
      showError('Erro ao excluir tutor. Tente novamente.');
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

  if (error || !tutor) {
    return (
      <>
        <NavBar />
        <div className="container">
          <Alert variant="danger" className="my-4">
            {error || 'Tutor não encontrado.'}
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
          <h2>Detalhes do Tutor</h2>
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
          {/* Foto do Tutor */}
          <Col md={4} className="mb-4">
            <Card className="h-100">
              {tutor.foto?.url ? (
                <Card.Img 
                  variant="top" 
                  src={tutor.foto.url} 
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

          {/* Informações do Tutor */}
          <Col md={8}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title as="h2" className="text-primary mb-4">
                  {tutor.nome}
                </Card.Title>
                
                <Row className="mb-3">
                  <Col sm={6} className="mb-2">
                    <strong>Email:</strong> {tutor.email}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Telefone:</strong> {tutor.telefone}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Endereço:</strong> {tutor.endereco}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>CPF:</strong> {tutor.cpf}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Pets Vinculados */}
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>Pets Vinculados</Card.Title>
                
                {/* Vincular Novo Pet */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-3">Vincular Novo Pet</h6>
                  
                  <Row className="align-items-end">
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>Selecione um Pet</Form.Label>
                        <Form.Select 
                          value={selectedPetId}
                          onChange={(e) => setSelectedPetId(e.target.value)}
                          disabled={loadingAvailablePets}
                        >
                          <option value="">
                            {loadingAvailablePets 
                              ? 'Carregando pets disponíveis...' 
                              : availablePets.length === 0 
                                ? 'Nenhum pet disponível para vincular'
                                : 'Selecione um pet para vincular'
                            }
                          </option>
                          {availablePets.map((pet: IPet) => (
                            <option key={pet.id} value={pet.id}>
                              {pet.nome} - {pet.raca}
                              {pet.idade !== null && ` (${pet.idade} anos)`}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          if (selectedPetId) {
                            vincularPet(selectedPetId);
                            setSelectedPetId('');
                          }
                        }}
                        disabled={!selectedPetId || loadingAvailablePets}
                        size="sm"
                        className="w-100"
                      >
                        Adicionar Vínculo
                      </Button>
                    </Col>
                  </Row>
                </div>
                
                {loadingAvailablePets ? (
                  <div className="text-center my-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Carregando pets...</span>
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center text-muted my-3">
                    <span className="me-2">⚠️</span>
                    Este tutor ainda não possui pet(s) vinculado(s).
                  </div>
                ) : (
                  <ListGroup>
                    {pets.map((pet: IPet) => (
                      <ListGroup.Item 
                        key={pet.id} 
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          {pet.foto?.url ? (
                            <img 
                              src={pet.foto.url} 
                              alt={pet.nome}
                              className="me-3 rounded-circle"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="bg-light d-flex align-items-center justify-content-center me-3 rounded-circle"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <span className="text-muted">🐕</span>
                            </div>
                          )}
                          <div>
                            <strong>{pet.nome}</strong> - {pet.raca}
                            {pet.idade !== null && ` (${pet.idade} anos)`}
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate(`/pets/${pet.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removerVinculo(pet.id)}
                          >
                            Remover Vínculo
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
