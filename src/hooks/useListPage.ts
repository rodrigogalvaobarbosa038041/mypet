import { useState, useEffect, SetStateAction } from 'react';
import { Api } from '../providers/Api';
import { ApiResponse, ListPageState } from '../types';

export function useListPage<T extends { id?: number; nome: string }>(
  endpoint: string,
  searchField: keyof T = 'nome' as keyof T
) {
  const [state, setState] = useState<ListPageState<T>>({
    data: [],
    allData: [],
    currentPage: 0,
    searchTerm: '',
    loading: false,
    totalPages: 0,
    totalCount: 0,
  });

  const dataPerPage = 10;

  // Get current page data
  const indexOfLastData = (state.currentPage + 1) * dataPerPage;
  const indexOfFirstData = state.currentPage * dataPerPage;
  const currentData = state.data.slice(indexOfFirstData, indexOfLastData);

  // Change page
  const setCurrentPage = (pageNumber: SetStateAction<number>) => {
    setState(prev => ({ 
      ...prev, 
      currentPage: typeof pageNumber === 'function' ? pageNumber(prev.currentPage) : pageNumber 
    }));
  };

  // Apply filter when search term changes
  useEffect(() => {
    if (state.allData.length > 0) {
      const filtered = state.searchTerm.trim()
        ? state.allData.filter((item: T) => {
            const fieldValue = item[searchField];
            return fieldValue && 
              typeof fieldValue === 'string' && 
              fieldValue.toLowerCase().includes(state.searchTerm.toLowerCase());
          })
        : state.allData;
      
      setState(prev => ({
        ...prev,
        data: filtered,
        currentPage: 0
      }));
    }
  }, [state.searchTerm, state.allData, searchField]);

  // Fetch data
  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch first page to get total count
      const response = await Api.get<ApiResponse<T>>(`${endpoint}?page=0&size=10`);
      const firstPageData = Array.isArray(response.data?.content) ? response.data.content : [];
      const totalPagesFromApi = response.data?.pageCount || 0;
      const totalCountFromApi = response.data?.total || 0;
      
      // If there are more pages, fetch all
      let allPagesData = [...firstPageData];
      
      if (totalPagesFromApi > 1) {
        for (let page = 1; page < totalPagesFromApi; page++) {
          try {
            const pageResponse = await Api.get<ApiResponse<T>>(`${endpoint}?page=${page}&size=10`);
            const pageData = Array.isArray(pageResponse.data?.content) ? pageResponse.data.content : [];
            allPagesData.push(...pageData);
          } catch (error) {
            console.error(`Erro ao buscar página ${page}:`, error);
          }
        }
      }
      
      setState(prev => ({
        ...prev,
        allData: allPagesData,
        data: allPagesData,
        totalPages: totalPagesFromApi,
        totalCount: totalCountFromApi,
        loading: false,
      }));
      
    } catch (error) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, error);
      setState(prev => ({
        ...prev,
        allData: [],
        data: [],
        totalPages: 0,
        totalCount: 0,
        loading: false,
      }));
    }
  };

  // Load initial data
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    ...state,
    currentData,
    dataPerPage,
    setCurrentPage,
    fetchData,
    setSearchTerm: (term: string) => setState(prev => ({ ...prev, searchTerm: term })),
  };
}
