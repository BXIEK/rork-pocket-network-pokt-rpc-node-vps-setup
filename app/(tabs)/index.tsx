import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Server,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  ChevronRight,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  ExternalLink,
  RefreshCw,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { poktSetupScript } from '@/constants/script';
import { trpc } from '@/lib/trpc';

const { width } = Dimensions.get('window');

interface NodeStatus {
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  peers: number;
  uptime: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'monitoring'>('overview');
  const [nodeUrl, setNodeUrl] = useState('http://localhost:8081');
  const [nodeStatus] = useState<NodeStatus>({
    status: 'online',
    blockHeight: 125847,
    peers: 23,
    uptime: '7d 14h 32m'
  });
  const [systemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 12
  });

  // tRPC queries
  const nodeInfoQuery = trpc.node.info.useQuery(
    { nodeUrl },
    { enabled: activeTab === 'overview' && !!nodeUrl }
  );

  const copyScript = async () => {
    try {
      await Clipboard.setStringAsync(poktSetupScript);
      Alert.alert('Sucesso', 'Script copiado para a área de transferência!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao copiar o script');
    }
  };

  const refreshNodeData = () => {
    nodeInfoQuery.refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'offline': return '#EF4444';
      case 'syncing': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'offline': return AlertTriangle;
      case 'syncing': return Info;
      default: return Server;
    }
  };

  const renderOverview = () => {
    const StatusIcon = getStatusIcon(nodeStatus.status);
    const liveData = nodeInfoQuery.data;
    
    return (
      <View style={styles.tabContent}>
        <View style={styles.nodeUrlInput}>
          <Text style={styles.inputLabel}>URL do Nó RPC:</Text>
          <TextInput
            style={styles.input}
            value={nodeUrl}
            onChangeText={setNodeUrl}
            placeholder="http://your-vps-ip:8081"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.refreshButton} onPress={refreshNodeData}>
            <RefreshCw size={20} color="#60A5FA" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <LinearGradient
            colors={['#1F2937', '#374151']}
            style={styles.statusGradient}
          >
            <View style={styles.statusHeader}>
              <StatusIcon size={24} color={getStatusColor(nodeStatus.status)} />
              <Text style={styles.statusTitle}>Status do Nó</Text>
            </View>
            <Text style={[styles.statusValue, { color: getStatusColor(nodeStatus.status) }]}>
              {liveData?.success ? 'ONLINE' : 'OFFLINE'}
            </Text>
            {liveData?.success && (
              <Text style={styles.liveDataText}>
                Dados ao vivo do nó conectado
              </Text>
            )}
          </LinearGradient>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Server size={20} color="#60A5FA" />
              <Text style={styles.metricLabel}>Altura do Bloco</Text>
            </View>
            <Text style={styles.metricValue}>
              {liveData?.success ? liveData.nodeInfo?.height : nodeStatus.blockHeight}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Wifi size={20} color="#34D399" />
              <Text style={styles.metricLabel}>Peers</Text>
            </View>
            <Text style={styles.metricValue}>
              {liveData?.success ? liveData.nodeInfo?.peers : nodeStatus.peers}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Shield size={20} color="#F472B6" />
              <Text style={styles.metricLabel}>Uptime</Text>
            </View>
            <Text style={styles.metricValue}>{nodeStatus.uptime}</Text>
          </View>
        </View>

        <View style={styles.systemMetrics}>
          <Text style={styles.sectionTitle}>Métricas do Sistema</Text>
          
          <View style={styles.metricRow}>
            <View style={styles.metricInfo}>
              <Cpu size={18} color="#60A5FA" />
              <Text style={styles.metricName}>CPU</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${systemMetrics.cpu}%`, backgroundColor: '#60A5FA' }]} />
            </View>
            <Text style={styles.metricPercent}>{systemMetrics.cpu}%</Text>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricInfo}>
              <HardDrive size={18} color="#34D399" />
              <Text style={styles.metricName}>Memória</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${systemMetrics.memory}%`, backgroundColor: '#34D399' }]} />
            </View>
            <Text style={styles.metricPercent}>{systemMetrics.memory}%</Text>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricInfo}>
              <HardDrive size={18} color="#F472B6" />
              <Text style={styles.metricName}>Disco</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${systemMetrics.disk}%`, backgroundColor: '#F472B6' }]} />
            </View>
            <Text style={styles.metricPercent}>{systemMetrics.disk}%</Text>
          </View>
        </View>
      </View>
    );
  };

  // Rest of the component remains the same, with updated script and monitoring sections

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>POKT Node Manager</Text>
          <Text style={styles.subtitle}>Gerencie seu nó RPC Pocket Network</Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Server size={18} color={activeTab === 'overview' ? '#60A5FA' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'setup' && styles.activeTab]}
            onPress={() => setActiveTab('setup')}
          >
            <Terminal size={18} color={activeTab === 'setup' ? '#60A5FA' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'setup' && styles.activeTabText]}>Setup</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'monitoring' && styles.activeTab]}
            onPress={() => setActiveTab('monitoring')}
          >
            <Shield size={18} color={activeTab === 'monitoring' ? '#60A5FA' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'monitoring' && styles.activeTabText]}>Monitor</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'setup' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Setup em desenvolvimento...</Text>
          </View>
        )}
        {activeTab === 'monitoring' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Monitoramento em desenvolvimento...</Text>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#374151',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#60A5FA',
  },
  tabContent: {
    flex: 1,
    paddingBottom: 20,
  },
  nodeUrlInput: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  refreshButton: {
    position: 'absolute',
    right: 32,
    top: 32,
    padding: 8,
  },
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveDataText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  systemMetrics: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  metricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    gap: 8,
  },
  metricName: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricPercent: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
});