import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Search, TrendingUp, RefreshCw } from "lucide-react";
import DataItemCard from "@/components/DataItemCard";
import SearchFilters from "@/components/SearchFilters";
import PaginationControls from "@/components/PaginationControls";
import { mockData, generateMoreMockData } from "@/data/mockData";
import { DataItem, SearchFilters as SearchFiltersType, PaginationInfo } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<DataItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0
  });

  // Initialize with mock data
  useEffect(() => {
    const allMockData = [...mockData, ...generateMoreMockData(40)];
    setItems(allMockData);
    applyFiltersAndPagination(allMockData, filters, 1, pagination.per_page);
  }, []);

  const applyFiltersAndPagination = (
    data: DataItem[], 
    currentFilters: SearchFiltersType, 
    page: number, 
    perPage: number
  ) => {
    let filtered = [...data];

    // Apply search query filter
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply source filter
    if (currentFilters.source) {
      filtered = filtered.filter(item => item.source === currentFilters.source);
    }

    // Apply data type filter
    if (currentFilters.data_type) {
      filtered = filtered.filter(item => item.data_type === currentFilters.data_type);
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    setFilteredItems(paginatedItems);
    setPagination({
      page,
      per_page: perPage,
      total,
      total_pages: totalPages
    });
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    applyFiltersAndPagination(items, newFilters, 1, pagination.per_page);
  };

  const handlePageChange = (page: number) => {
    applyFiltersAndPagination(items, filters, page, pagination.per_page);
  };

  const handlePerPageChange = (perPage: number) => {
    applyFiltersAndPagination(items, filters, 1, perPage);
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Data refreshed",
        description: "Successfully fetched latest data from APIs"
      });
      setLoading(false);
    }, 1500);
  };

  const getStats = () => {
    const sources = items.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: items.length,
      sources,
      latest: items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Database className="h-8 w-8 text-primary" />
                Data Fetcher API
              </h1>
              <p className="text-muted-foreground mt-1">
                Collect, store, and search data from multiple sources
              </p>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{stats.total}</span>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reddit Posts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <span className="text-2xl font-bold text-orange-600">{stats.sources.reddit || 0}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">GitHub Repos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <span className="text-2xl font-bold text-gray-700">{stats.sources.github || 0}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Other Sources</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <span className="text-2xl font-bold text-blue-600">{stats.sources.other || 0}</span>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilters 
              onFiltersChange={handleFiltersChange}
              activeFilters={filters}
            />
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results
              {Object.keys(filters).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  Filtered
                </Badge>
              )}
            </h2>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <DataItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {/* Pagination */}
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-2">
                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* API Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-sm">
                <Badge variant="secondary">GET</Badge>
                <code>/api/items</code>
                <span className="text-muted-foreground">- List all items (paginated)</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm">
                <Badge variant="secondary">GET</Badge>
                <code>/api/items?q=keyword</code>
                <span className="text-muted-foreground">- Search items by keyword</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect to Supabase to enable live data collection from Reddit, GitHub, and other sources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
