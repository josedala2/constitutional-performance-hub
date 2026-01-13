import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface HelpSection {
  title: string;
  content: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface HelpContent {
  id: string;
  route: string;
  title: string;
  description: string;
  icon: string;
  sections: HelpSection[];
  tips: string[];
  related_links: RelatedLink[];
  legal_references: string[];
  keywords: string[];
  created_at: string;
  updated_at: string;
}

function parseJsonArray<T>(json: Json | null, fallback: T[]): T[] {
  if (!json) return fallback;
  if (Array.isArray(json)) return json as unknown as T[];
  return fallback;
}

function mapToHelpContent(item: {
  id: string;
  route: string;
  title: string;
  description: string;
  icon: string | null;
  sections: Json | null;
  tips: string[] | null;
  related_links: Json | null;
  legal_references: string[] | null;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
}): HelpContent {
  return {
    id: item.id,
    route: item.route,
    title: item.title,
    description: item.description,
    icon: item.icon || 'HelpCircle',
    sections: parseJsonArray<HelpSection>(item.sections, []),
    tips: item.tips || [],
    related_links: parseJsonArray<RelatedLink>(item.related_links, []),
    legal_references: item.legal_references || [],
    keywords: item.keywords || [],
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export function useHelpContent(route: string) {
  return useQuery({
    queryKey: ['help-content', route],
    queryFn: async () => {
      // Try exact match first
      let { data, error } = await supabase
        .from('help_content')
        .select('*')
        .eq('route', route)
        .maybeSingle();

      if (error) throw error;

      // If no exact match, try parent route
      if (!data && route !== '/') {
        const parentRoute = route.split('/').slice(0, -1).join('/') || '/';
        const { data: parentData, error: parentError } = await supabase
          .from('help_content')
          .select('*')
          .eq('route', parentRoute)
          .maybeSingle();

        if (parentError) throw parentError;
        data = parentData;
      }

      if (!data) return null;

      return mapToHelpContent(data);
    },
  });
}

export function useAllHelpContent() {
  return useQuery({
    queryKey: ['help-content-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_content')
        .select('*')
        .order('title');

      if (error) throw error;

      return data.map(mapToHelpContent);
    },
  });
}

export function useSearchHelpContent(searchQuery: string) {
  return useQuery({
    queryKey: ['help-content-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const { data, error } = await supabase
        .rpc('search_help_content', { search_query: searchQuery });

      if (error) throw error;

      return (data || []).map((item: {
        id: string;
        route: string;
        title: string;
        description: string;
        icon: string | null;
        sections: Json | null;
        tips: string[] | null;
        related_links: Json | null;
        legal_references: string[] | null;
        keywords: string[] | null;
        created_at: string;
        updated_at: string;
      }) => mapToHelpContent(item));
    },
    enabled: searchQuery.length >= 2,
  });
}
