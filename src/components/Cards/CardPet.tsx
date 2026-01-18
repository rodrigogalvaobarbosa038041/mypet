import { IPet } from '../../types';

interface PetCardProps {
  pet: IPet;
  onClick: (petId: number) => void;
}

export function CardPet({ pet, onClick }: PetCardProps) {
  const handleClick = () => {
    if (pet.id) {
      onClick(pet.id);
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
      {/* Imagem do Pet */}
      <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
        {pet.foto?.url ? (
          <img 
            src={pet.foto.url} 
            alt={pet.nome}
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
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <div className="mt-2">Sem foto</div>
          </div>
        )}
      </div>

      {/* Informações do Pet */}
      <div className="card-body">
        <h5 className="card-title text-primary mb-2">
          {pet.nome}
        </h5>
        
        <div className="text-muted small">
          <div className="mb-1">
            <strong>Raça:</strong> {pet.raca}
          </div>
          
          <div>
            <strong>Idade:</strong> {pet.idade !== null && pet.idade !== undefined 
              ? `${pet.idade} ${pet.idade === 1 ? 'ano' : 'anos'}` 
              : 'Não informada'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
