import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { NavBar } from '../../components/Nav/NavBar';
import { Api } from '../../providers/Api';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { ITutor } from '../../types';

export default function TutorFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detectar se é modo de edição ou cadastro
  const isEditing = location.pathname.includes('/editar');

  const [tutor, setTutor] = useState<ITutor>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf: 0,
    foto: null
  });
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Buscar dados do tutor se for edição
  const loadTutor = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await Api.get(`v1/tutores/${id}`);
      setTutor(response.data);
      if (response.data.foto?.url) {
        setPreviewUrl(response.data.foto.url);
      }
    } catch (error) {
      setError('Não foi possível carregar os dados do tutor.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isEditing) {
      loadTutor();
    }
  }, [id, isEditing]);

  // Lidar com mudanças nos campos do formulário
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      // Máscara para CPF - apenas números
      const numericValue = value.replace(/\D/g, '');
      setTutor(prev => ({
        ...prev,
        [name]: numericValue ? parseInt(numericValue) : 0
      }));
    } else if (name === 'telefone') {
      // Máscara para telefone
      const phoneValue = value.replace(/\D/g, '');
      const formattedPhone = phoneValue.length > 10 
        ? `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2, 7)}-${phoneValue.slice(7)}`
        : phoneValue.length > 6 
          ? `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2, 6)}-${phoneValue.slice(6)}`
          : phoneValue.length > 2 
            ? `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2)}`
            : phoneValue;
      
      setTutor(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setTutor(prev => ({
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
        // Atualizar tutor
        await Api.put(`v1/tutores/${id}`, tutor);
        setSuccess('Tutor atualizado com sucesso!');
        setTimeout(() => navigate(`/tutores/${id}`), 1500);
      } else {
        // Criar novo tutor
        const response = await Api.post('v1/tutores', tutor);
        setSuccess('Tutor cadastrado com sucesso!');
        
        // Se houver arquivo, fazer upload
        if (selectedFile) {
          await uploadPhoto(response.data.id);
        } else {
          setTimeout(() => navigate('/tutores'), 1500);
        }
      }
    } catch (error) {
      setError(isEditing ? 'Erro ao atualizar tutor.' : 'Erro ao cadastrar tutor.');
    } finally {
      setLoading(false);
    }
  };

  // Upload de foto
  const uploadPhoto = async (tutorId: any) => {
    if (!selectedFile) return;
    
    setLoadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      await Api.post(`v1/tutores/${tutorId}/fotos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Tutor e foto cadastrados com sucesso!');
      setTimeout(() => navigate('/tutores'), 1500);
    } catch (error) {
      setError('Tutor cadastrado, mas erro ao fazer upload da foto.');
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
      
      await Api.post(`v1/tutores/${id}/fotos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Foto atualizada com sucesso!');
      setSelectedFile(null);
      await loadTutor(); // Recarregar dados para mostrar nova foto
    } catch (error) {
      setError('Erro ao atualizar foto.');
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Remover foto do tutor
  const removePhoto = async () => {
    if (!id || !tutor?.foto?.id) return;
    
    if (!window.confirm('Tem certeza que deseja remover esta foto?')) {
      return;
    }
    
    try {
      await Api.delete(`v1/tutores/${id}/fotos/${tutor.foto.id}`);
      setSuccess('Foto removida com sucesso!');
      await loadTutor(); // Recarregar dados para remover foto da interface
    } catch (error) {
      setError('Erro ao remover foto.');
    }
  };


  const voltar = () => {
    if (isEditing && id) {
      navigate(`/tutores/${id}`);
    } else {
      navigate('/tutores');
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
          <h2>
            {isEditing ? 'Editar Tutor' : 'Cadastrar Novo Tutor'}
          </h2>
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
                    <Col md={12} className="mb-3">
                      <Form.Label htmlFor="nome">Nome Completo *</Form.Label>
                      <Form.Control
                        id="nome"
                        name="nome"
                        type="text"
                        value={tutor.nome}
                        onChange={handleChange}
                        required
                        placeholder="Digite o nome completo do tutor"
                        maxLength={200}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="email">Email *</Form.Label>
                      <Form.Control
                        id="email"
                        name="email"
                        type="email"
                        value={tutor.email}
                        onChange={handleChange}
                        required
                        placeholder="Digite o email do tutor"
                        maxLength={100}
                        disabled={false}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="telefone">Telefone *</Form.Label>
                      <Form.Control
                        id="telefone"
                        name="telefone"
                        type="text"
                        value={tutor.telefone}
                        onChange={handleChange}
                        required
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        disabled={false}
                      />
                      <Form.Text className="text-muted">
                        Formato: (00) 00000-0000
                      </Form.Text>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Label htmlFor="endereco">Endereço *</Form.Label>
                      <Form.Control
                        id="endereco"
                        name="endereco"
                        type="text"
                        value={tutor.endereco}
                        onChange={handleChange}
                        required
                        placeholder="Digite o endereço completo"
                        maxLength={300}
                        disabled={false}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label htmlFor="cpf">CPF *</Form.Label>
                      <Form.Control
                        id="cpf"
                        name="cpf"
                        type="text"
                        value={tutor.cpf || ''}
                        onChange={handleChange}
                        required
                        placeholder="Digite o CPF (apenas números)"
                        maxLength={11}
                        disabled={false}
                      />
                      <Form.Text className="text-muted">
                        Apenas números. Ex: 12345678901
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
                          isEditing ? 'Atualizar Tutor' : 'Cadastrar Tutor'
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
                <Card.Title>Foto do Tutor</Card.Title>
                
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

                {isEditing && tutor?.foto && !selectedFile && (
                  <Button 
                    variant="outline-danger" 
                    onClick={removePhoto}
                    disabled={loadingPhoto}
                    className="w-100 mt-2"
                  >
                    🗑️ Remover Foto
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
