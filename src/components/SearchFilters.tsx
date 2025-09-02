import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { SearchFilters as SearchFiltersType } from "@/types/api";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFiltersType) => void;
  activeFilters: SearchFiltersType;
}

const SearchFilters = ({ onFiltersChange, activeFilters }: SearchFiltersProps) => {
  const [query, setQuery] = useState(activeFilters.query || '');
  
  const handleSearch = () => {
    onFiltersChange({
      ...activeFilters,
      query: query.trim() || undefined
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilter = (filterKey: keyof SearchFiltersType) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
    if (filterKey === 'query') {
      setQuery('');
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items by keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4"
          />
        </div>
        <Button onClick={handleSearch} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select
          value={activeFilters.source || 'all'}
          onValueChange={(value) => onFiltersChange({
            ...activeFilters,
            source: value === 'all' ? undefined : value as any
          })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="reddit">Reddit</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={activeFilters.data_type || 'all'}
          onValueChange={(value) => onFiltersChange({
            ...activeFilters,
            data_type: value === 'all' ? undefined : value
          })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="repository">Repositories</SelectItem>
            <SelectItem value="issue">Issues</SelectItem>
            <SelectItem value="discussion">Discussions</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="gap-1"
          >
            <X className="h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.query && (
            <Badge variant="secondary" className="gap-1">
              Query: "{activeFilters.query}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => clearFilter('query')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.source && (
            <Badge variant="secondary" className="gap-1">
              Source: {activeFilters.source}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => clearFilter('source')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.data_type && (
            <Badge variant="secondary" className="gap-1">
              Type: {activeFilters.data_type}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => clearFilter('data_type')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;