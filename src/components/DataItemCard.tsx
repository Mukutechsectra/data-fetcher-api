import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, User, TrendingUp } from "lucide-react";
import { DataItem } from "@/types/api";

interface DataItemCardProps {
  item: DataItem;
}

const DataItemCard = ({ item }: DataItemCardProps) => {
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'reddit': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'github': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
          <Badge className={getSourceColor(item.source)}>
            {item.source}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{item.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.created_at)}</span>
          </div>
          {item.score && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{item.score}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 gap-1 text-primary hover:text-primary-foreground hover:bg-primary"
            onClick={() => window.open(item.url, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
            <span className="text-xs">View</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataItemCard;