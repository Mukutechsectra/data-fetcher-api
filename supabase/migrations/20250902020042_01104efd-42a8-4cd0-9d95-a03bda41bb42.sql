-- Create table for storing collected data items
CREATE TABLE public.data_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL CHECK (source IN ('reddit', 'github', 'other')),
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  url TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  data_type TEXT NOT NULL,
  external_id TEXT,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.data_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is a public API)
CREATE POLICY "Allow public read access to data_items" 
ON public.data_items 
FOR SELECT 
USING (true);

-- Create policy to allow public insert (for data collection)
CREATE POLICY "Allow public insert to data_items" 
ON public.data_items 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_data_items_source ON public.data_items(source);
CREATE INDEX idx_data_items_data_type ON public.data_items(data_type);
CREATE INDEX idx_data_items_created_at ON public.data_items(created_at DESC);
CREATE INDEX idx_data_items_score ON public.data_items(score DESC);
CREATE INDEX idx_data_items_tags ON public.data_items USING GIN(tags);
CREATE INDEX idx_data_items_external_id ON public.data_items(external_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_data_items_updated_at
BEFORE UPDATE ON public.data_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();