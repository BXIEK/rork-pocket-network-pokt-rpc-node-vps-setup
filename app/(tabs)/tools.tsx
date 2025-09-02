import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ExternalLink,
  Monitor,
  Terminal,
  Globe,
  Shield,
  Activity,
  Settings,
  Database,
} from 'lucide-react-native';

interface ToolCardProps {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  category: 'monitoring' | 'network' | 'security' | 'development';
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, url, icon, category }) => {
  const getCategoryColor = (): readonly [string, string] => {
    switch (category) {
      case 'monitoring':
        return ['#10b981', '#059669'] as const;
      case 'network':
        return ['#3b82f6', '#2563eb'] as const;
      case 'security':
        return ['#f59e0b', '#d97706'] as const;
      case 'development':
        return ['#8b5cf6', '#7c3aed'] as const;
      default:
        return ['#6b7280', '#4b5563'] as const;
    }
  };

  const handlePress = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o link');
    }
  };

  return (
    <TouchableOpacity style={styles.toolCard} onPress={handlePress}>
      <LinearGradient
        colors={getCategoryColor()}
        style={styles.toolIconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon}
      </LinearGradient>
      <View style={styles.toolContent}>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolDescription}>{description}</Text>
        <View style={styles.toolFooter}>
          <ExternalLink size={16} color="#6b7280" />
          <Text style={styles.toolUrl}>{url.replace('https://', '')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ToolsScreen() {
  const tools: ToolCardProps[] = [
    {
      title: 'POKT Network Explorer',
      description: 'Explorador oficial da blockchain POKT para verificar transações e nós',
      url: 'https://explorer.pokt.network',
      icon: <Globe size={24} color="white" />,
      category: 'network'
    },
    {
      title: 'Node Pilot',
      description: 'Dashboard para monitoramento e gerenciamento de nós POKT',
      url: 'https://www.nodepilot.tech',
      icon: <Monitor size={24} color="white" />,
      category: 'monitoring'
    },
    {
      title: 'POKT Scan',
      description: 'Ferramenta avançada de análise e estatísticas da rede POKT',
      url: 'https://poktscan.com',
      icon: <Activity size={24} color="white" />,
      category: 'monitoring'
    },
    {
      title: 'Pocket Core Docs',
      description: 'Documentação oficial do Pocket Core para desenvolvedores',
      url: 'https://docs.pokt.network',
      icon: <Terminal size={24} color="white" />,
      category: 'development'
    },
    {
      title: 'POKT DAO Forum',
      description: 'Fórum da comunidade para discussões e governança',
      url: 'https://forum.pokt.network',
      icon: <Settings size={24} color="white" />,
      category: 'development'
    },
    {
      title: 'Pocket Network Status',
      description: 'Status em tempo real da rede e serviços POKT',
      url: 'https://status.pokt.network',
      icon: <Shield size={24} color="white" />,
      category: 'security'
    },
    {
      title: 'C0D3R Node Tools',
      description: 'Ferramentas e scripts para operadores de nós POKT',
      url: 'https://c0d3r.org/POKTNodeTools',
      icon: <Database size={24} color="white" />,
      category: 'development'
    },
    {
      title: 'POKT Network GitHub',
      description: 'Repositório oficial do código fonte da Pocket Network',
      url: 'https://github.com/pokt-network',
      icon: <Terminal size={24} color="white" />,
      category: 'development'
    }
  ];

  const groupedTools = {
    monitoring: tools.filter(tool => tool.category === 'monitoring'),
    network: tools.filter(tool => tool.category === 'network'),
    security: tools.filter(tool => tool.category === 'security'),
    development: tools.filter(tool => tool.category === 'development')
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.header}
          >
            <Settings size={40} color="#4f46e5" />
            <Text style={styles.title}>🛠️ Ferramentas POKT</Text>
            <Text style={styles.subtitle}>Recursos essenciais para operadores de nós</Text>
          </LinearGradient>

          {/* Monitoring Tools */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Monitor size={24} color="white" />
              <Text style={styles.sectionTitle}>📊 Monitoramento</Text>
            </View>
            {groupedTools.monitoring.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </View>

          {/* Network Tools */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={24} color="white" />
              <Text style={styles.sectionTitle}>🌐 Rede</Text>
            </View>
            {groupedTools.network.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </View>

          {/* Security Tools */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={24} color="white" />
              <Text style={styles.sectionTitle}>🔒 Segurança</Text>
            </View>
            {groupedTools.security.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </View>

          {/* Development Tools */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Terminal size={24} color="white" />
              <Text style={styles.sectionTitle}>⚡ Desenvolvimento</Text>
            </View>
            {groupedTools.development.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </View>
        </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  toolCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  toolIconContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolContent: {
    flex: 1,
    padding: 20,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  toolDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  toolFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolUrl: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 5,
  },
});