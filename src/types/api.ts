export interface DataItem {
  id: string;
  title: string;
  description: string;
  source: 'reddit' | 'github' | 'other';
  author: string;
  created_at: string;
  url: string;
  score?: number;
  tags: string[];
  data_type: string;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface SearchFilters {
  query?: string;
  source?: 'reddit' | 'github' | 'other' | 'all';
  data_type?: string;
}