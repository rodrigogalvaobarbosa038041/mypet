import { ITutor } from '../../types';

interface TutorCardProps {
  tutor: ITutor;
  onClick: (tutorId: number) => void;
}

export function CardTutor({ tutor, onClick }: TutorCardProps) {
  const handleClick = () => {
    if (tutor.id) {
      onClick(tutor.id);
    }
  };

  return (
    <div 
      className="card h-100 shadow-sm hover-shadow transition-all duration-300 cursor-pointer"
      style={{ 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={handleClick}
    >
      {/* Foto do Tutor */}
      <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
        {tutor.foto?.url ? (
          <img 
            src={tutor.foto.url} 
            alt={tutor.nome}
            className="img-fluid"
            style={{ 
              height: '100%', 
              objectFit: 'cover',
              width: '100%'
            }}
          />
        ) : (
          <div className="text-center text-muted">
            <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <div className="mt-2">Sem foto</div>
          </div>
        )}
      </div>

      {/* Informações do Tutor */}
      <div className="card-body">
        <h5 className="card-title text-primary mb-2">
          {tutor.nome}
        </h5>
        
        <div className="text-muted small">
          <div className="mb-1">
            <strong>Email:</strong> {tutor.email}
          </div>
          
          <div className="mb-1">
            <strong>Telefone:</strong> {tutor.telefone}
          </div>
          
          <div>
            <strong>Endereço:</strong> {tutor.endereco}
          </div>
        </div>
      </div>
    </div>
  );
}
