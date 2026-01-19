import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div> 
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={4} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <img 
                      src="/dog-icon.svg" 
                      alt="Meu Pet" 
                      style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    />
                    <h2 className="fw-bold mb-0">Meu Pet</h2>
                  </div>
                  <div className="mb-3">
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Usuário
                        </Form.Label>
                        <Form.Control type="username" placeholder="Usuário" onChange={(e: any) => setUsername(e.target.value)}/>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" placeholder="Senha" onChange={(e: any) => setPassword(e.target.value)}/>
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="button" onClick={handleLogin}>
                          Login
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
