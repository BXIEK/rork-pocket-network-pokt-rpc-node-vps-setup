export type Json =
      | string
      | number
      | boolean
      | null
      | { [key: string]: Json | undefined }
      | Json[]

    export interface Database {
      public: {
        Tables: {
          nodes: {
            Row: {
              id: string
              address: string
              status: string
              block_height: number
              peers: number
              uptime: string
              created_at: string
              updated_at: string
            }
            Insert: {
              id?: string
              address: string
              status: string
              block_height: number
              peers: number
              uptime: string
              created_at?: string
              updated_at?: string
            }
            Update: {
              id?: string
              address?: string
              status?: string
              block_height?: number
              peers?: number
              uptime?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
        Views: {
          [_ in never]: never
        }
        Functions: {
          [_ in never]: never
        }
        Enums: {
          [_ in never]: never
        }
      }
    }