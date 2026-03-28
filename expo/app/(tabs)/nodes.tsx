import React from 'react';
    import {
      ScrollView,
      View,
      Text,
      StyleSheet,
      TouchableOpacity,
      Alert,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import {
      Server,
      Plus,
      Edit,
      Trash2,
    } from 'lucide-react-native';
    import { useNodes, useCreateNode, useUpdateNode } from '@/hooks/useSupabase';

    export default function NodesScreen() {
      const { data: nodes, isLoading, error } = useNodes();
      const createNode = useCreateNode();
      const updateNode = useUpdateNode();

      const handleAddNode = () => {
        Alert.prompt(
          'Add Node',
          'Enter node address',
          (address) => {
            if (address) {
              createNode.mutate({
                address,
                status: 'offline',
                block_height: 0,
                peers: 0,
                uptime: '0d 0h 0m',
              });
            }
          }
        );
      };

      const handleEditNode = (node: any) => {
        Alert.prompt(
          'Edit Node',
          'Enter new address',
          (address) => {
            if (address) {
              updateNode.mutate({
                id: node.id,
                updates: { address },
              });
            }
          },
          'plain-text',
          node.address
        );
      };

      const handleDeleteNode = (id: string) => {
        Alert.alert(
          'Delete Node',
          'Are you sure?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                // Implement delete mutation if needed
              },
            },
          ]
        );
      };

      if (isLoading) return <Text>Loading...</Text>;
      if (error) return <Text>Error: {error.message}</Text>;

      return (
        <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Nodes</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddNode}>
                <Plus size={20} color="#60A5FA" />
              </TouchableOpacity>
            </View>

            {nodes?.map((node) => (
              <View key={node.id} style={styles.nodeCard}>
                <View style={styles.nodeHeader}>
                  <Server size={24} color="#60A5FA" />
                  <Text style={styles.nodeAddress}>{node.address}</Text>
                  <View style={styles.nodeActions}>
                    <TouchableOpacity onPress={() => handleEditNode(node)}>
                      <Edit size={20} color="#60A5FA" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteNode(node.id)}>
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.nodeStatus}>Status: {node.status}</Text>
                <Text style={styles.nodeDetails}>
                  Block: {node.block_height} | Peers: {node.peers} | Uptime: {node.uptime}
                </Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      scrollView: {
        flex: 1,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      addButton: {
        padding: 10,
      },
      nodeCard: {
        backgroundColor: '#1F2937',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 20,
        borderRadius: 12,
      },
      nodeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      nodeAddress: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#FFFFFF',
      },
      nodeActions: {
        flexDirection: 'row',
        gap: 10,
      },
      nodeStatus: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 5,
      },
      nodeDetails: {
        fontSize: 12,
        color: '#6B7280',
      },
    });