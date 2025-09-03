import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
    import { supabase } from '../lib/supabase';
    import { Database } from '../types/supabase';

    type Node = Database['public']['Tables']['nodes']['Row'];
    type NodeInsert = Database['public']['Tables']['nodes']['Insert'];
    type NodeUpdate = Database['public']['Tables']['nodes']['Update'];

    export const useNodes = () => {
      return useQuery({
        queryKey: ['nodes'],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('nodes')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data;
        },
      });
    };

    export const useCreateNode = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (node: NodeInsert) => {
          const { data, error } = await supabase
            .from('nodes')
            .insert(node)
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['nodes'] });
        },
      });
    };

    export const useUpdateNode = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: NodeUpdate }) => {
          const { data, error } = await supabase
            .from('nodes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['nodes'] });
        },
      });
    };