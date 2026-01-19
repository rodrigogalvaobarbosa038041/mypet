import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/Nav/NavBar';
import { Api } from '../../providers/Api';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { IPet, ITutor } from '../../types';

export default function PetFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [pet, setPet] = useState<IPet>({
    nome: '',
    raca: '',
    idade: null,
    foto: null
  });
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Buscar dados do pet se for edição
  const loadPet = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await Api.get(`v1/pets/${id}`);
      setPet(response.data);
      if (response.data.foto?.url) {
        setPreviewUrl(response.data.foto.url);
      }
    } catch (error) {
      console.error('Erro ao buscar pet:', error);
      setError('Não foi possível carregar os dados do pet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPet();
  }, [id]);

  // Lidar com mudanças nos campos do formulário
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === 'idade') {
      // Máscara para idade - apenas números
      const numericValue = value.replace(/\D/g, '');
      setPet(prev => ({
        ...prev,
        [name]: numericValue ? parseInt(numericValue) : null
      }));
    } else {
      setPet(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Lidar com seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      
      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        // Atualizar pet
        await Api.put(`v1/pets/${id}`, pet);
        setSuccess('Pet atualizado com sucesso!');
      } else {
        // Criar novo pet
        const response = await Api.post('v1/pets', pet);
        setSuccess('Pet cadastrado com sucesso!');
        
        // Se houver arquivo, fazer upload
        if (selectedFile) {
          await uploadPhoto(response.data.id);
        } else {
          setTimeout(() => navigate(`/pets/${response.data.id}`), 1500);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      setError(isEditing ? 'Erro ao atualizar pet.' : 'Erro ao cadastrar pet.');
    } finally {
      setLoading(false);
    }
  };

  // Upload de foto
  const uploadPhoto = async (petId: any) => {
    if (!selectedFile) return;
    
    setLoadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      await Api.post(`v1/pets/${petId}/fotos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Pet e foto cadastrados com sucesso!');
      setTimeout(() => navigate(`/pets/${petId}`), 1500);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      setError('Pet cadastrado, mas erro ao fazer upload da foto.');
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Upload de foto (para edição)
  const handlePhotoUpload = async () => {
    if (!selectedFile || !id) return;
    
    setLoadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      await Api.post(`v1/pets/${id}/fotos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Foto atualizada com sucesso!');
      setSelectedFile(null);
      await loadPet(); // Recarregar dados para mostrar nova foto
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      setError('Erro ao atualizar foto.');
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Remover foto do pet
  const removePhoto = async () => {
    if (!id || !pet?.foto?.id) return;
    
    if (!window.confirm('Tem certeza que deseja remover esta foto?')) {
      return;
    }
    
    try {
      await Api.delete(`v1/pets/${id}/fotos/${pet.foto.id}`);
      setSuccess('Foto removida com sucesso!');
      await loadPet(); // Recarregar dados para remover foto da interface
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      setError('Erro ao remover foto.');
    }
  };

  const voltar = () => {
    if (isEditing && id) {
      navigate(`/pets/${id}`);
    } else {
      navigate('/');
    }
  };

  if (loading && isEditing) {
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

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{isEditing ? 'Editar Pet' : 'Cadastrar Novo Pet'}</h2>
          <Button variant="secondary" onClick={voltar}>
            ← Voltar
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row>
          {/* Formulário */}
          <Col md={8}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="nome">Nome do Pet *</Form.Label>
                      <Form.Control
                        id="nome"
                        name="nome"
                        type="text"
                        value={pet.nome}
                        onChange={handleChange}
                        required
                        placeholder="Digite o nome do pet"
                        maxLength={100}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="raca">Raça *</Form.Label>
                      <Form.Control
                        id="raca"
                        name="raca"
                        type="text"
                        value={pet.raca}
                        onChange={handleChange}
                        required
                        placeholder="Digite a raça do pet"
                        maxLength={100}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="idade">Idade (anos)</Form.Label>
                      <Form.Control
                        id="idade"
                        name="idade"
                        type="text"
                        value={pet.idade || ''}
                        onChange={handleChange}
                        placeholder="Digite a idade em anos"
                        maxLength={3}
                      />
                      <Form.Text className="text-muted">
                        Apenas números. Ex: 3, 7, 12
                      </Form.Text>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || loadingPhoto}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          {' '}Salvando...
                        </>
                      ) : (
                        isEditing ? 'Atualizar Pet' : 'Cadastrar Pet'
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={voltar}
                      disabled={loading || loadingPhoto}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Upload de Foto */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Foto do Pet</Card.Title>
                
                {/* Preview da foto */}
                <div className="mb-3">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{ height: '200px' }}
                    >
                      <span className="text-muted">Sem foto</span>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="foto">Selecionar Foto</Form.Label>
                  <Form.Control
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loadingPhoto}
                  />
                  <Form.Text className="text-muted">
                    Formatos: JPG, PNG, GIF. Máximo: 5MB
                  </Form.Text>
                </Form.Group>

                {isEditing && selectedFile && (
                  <Button 
                    variant="outline-primary" 
                    onClick={handlePhotoUpload}
                    disabled={loadingPhoto}
                    className="w-100"
                  >
                    {loadingPhoto ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" />
                        {' '}Enviando...
                      </>
                    ) : (
                      'Atualizar Foto'
                    )}
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
