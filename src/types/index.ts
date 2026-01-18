export interface Foto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface IPet {
  id?: number;
  nome: string;
  raca: string;
  idade: number | null;
  foto?: Foto | null;
  idTutor?: number;
}

export interface ITutor {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number | string;
  foto?: Foto | null;
}

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

export interface ListPageState<T> {
  data: T[];
  allData: T[];
  currentPage: number;
  searchTerm: string;
  loading: boolean;
  totalPages: number;
  totalCount: number;
}
