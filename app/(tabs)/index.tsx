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
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { poktSetupScript } from '@/constants/script';

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

  const copyScript = async () => {
    try {
      await Clipboard.setStringAsync(poktSetupScript);
      Alert.alert('Sucesso', 'Script copiado para a área de transferência!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao copiar o script');
    }
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
    
    return (
      <View style={styles.tabContent}>
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
              {nodeStatus.status.toUpperCase()}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Server size={20} color="#60A5FA" />
              <Text style={styles.metricLabel}>Altura do Bloco</Text>
            </View>
            <Text style={styles.metricValue}>{nodeStatus.blockHeight.toLocaleString()}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Wifi size={20} color="#34D399" />
              <Text style={styles.metricLabel}>Peers</Text>
            </View>
            <Text style={styles.metricValue}>{nodeStatus.peers}</Text>
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

  const renderSetup = () => (
    <View style={styles.tabContent}>
      <View style={styles.setupHeader}>
        <Terminal size={24} color="#60A5FA" />
        <Text style={styles.setupTitle}>Script de Configuração</Text>
        <Text style={styles.setupSubtitle}>Execute este script no seu servidor Ubuntu/Debian</Text>
      </View>

      <View style={styles.scriptContainer}>
        <View style={styles.scriptHeader}>
          <Text style={styles.scriptTitle}>setup-pokt-node.sh</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyScript}>
            <Copy size={16} color="#60A5FA" />
            <Text style={styles.copyButtonText}>Copiar</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scriptScroll} horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.scriptContent}>
            {poktSetupScript}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>Instruções:</Text>
        <Text style={styles.instructionText}>1. Copie o script acima</Text>
        <Text style={styles.instructionText}>2. Salve como setup-pokt-node.sh no seu servidor</Text>
        <Text style={styles.instructionText}>3. Execute: chmod +x setup-pokt-node.sh</Text>
        <Text style={styles.instructionText}>4. Execute: ./setup-pokt-node.sh</Text>
        <Text style={styles.instructionText}>5. Siga as instruções na tela</Text>
      </View>
    </View>
  );

  const renderMonitoring = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Comandos de Monitoramento</Text>
      
      <View style={styles.commandCard}>
        <Text style={styles.commandTitle}>Verificar Status do Nó</Text>
        <View style={styles.commandContainer}>
          <Text style={styles.commandText}>docker-compose logs -f pokt-core</Text>
        </View>
      </View>

      <View style={styles.commandCard}>
        <Text style={styles.commandTitle}>Verificar Altura do Bloco</Text>
        <View style={styles.commandContainer}>
          <Text style={styles.commandText}>curl -X POST http://localhost:8081/v1/query/height</Text>
        </View>
      </View>

      <View style={styles.commandCard}>
        <Text style={styles.commandTitle}>Verificar Saldo da Carteira</Text>
        <View style={styles.commandContainer}>
          <Text style={styles.commandText}>docker-compose exec pokt-core pokt query balance [ADDRESS]</Text>
        </View>
      </View>

      <View style={styles.linksCard}>
        <Text style={styles.linksTitle}>Links Úteis</Text>
        
        <TouchableOpacity style={styles.linkItem}>
          <ExternalLink size={16} color="#60A5FA" />
          <Text style={styles.linkText}>Portal POKT</Text>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem}>
          <ExternalLink size={16} color="#60A5FA" />
          <Text style={styles.linkText}>Documentação Oficial</Text>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem}>
          <ExternalLink size={16} color="#60A5FA" />
          <Text style={styles.linkText}>Discord da Comunidade</Text>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>POKT Node Manager</Text>
          <Text style={styles.subtitle}>Gerencie seu nó Pocket Network</Text>
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
        {activeTab === 'setup' && renderSetup()}
        {activeTab === 'monitoring' && renderMonitoring()}
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
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center' as const,
  },
  tabBar: {
    flexDirection: 'row' as const,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#374151',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#60A5FA',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden' as const,
  },
  statusGradient: {
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  metricsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    marginLeft: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  systemMetrics: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginBottom: 16,
  },
  metricInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    width: 80,
  },
  metricName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricPercent: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#FFFFFF',
    width: 40,
    textAlign: 'right' as const,
  },
  setupHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  setupSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center' as const,
  },
  scriptContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden' as const,
  },
  scriptHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  scriptTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#FFFFFF',
  },
  copyButton: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  copyButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#60A5FA',
  },
  scriptScroll: {
    maxHeight: 300,
  },
  scriptContent: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#E5E7EB',
    padding: 16,
    lineHeight: 18,
  },
  instructionsCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    lineHeight: 20,
  },
  commandCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  commandTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  commandContainer: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
  },
  commandText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#60A5FA',
  },
  linksCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
  },
  linksTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  linkItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#E5E7EB',
  },
});