import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Server,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
  ChevronRight,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

interface VPSSetupStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  link?: string;
  completed: boolean;
}

export default function VPSSetupScreen() {
  const [vpsIp, setVpsIp] = useState('');
  const [vpsPassword, setVpsPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const setupSteps: VPSSetupStep[] = [
    {
      id: 'purchase',
      title: '1. Comprar VPS Hostinger',
      description: 'Acesse o painel Hostinger e compre um VPS com Ubuntu 22.04, mínimo 2GB RAM.',
      link: 'https://www.hostinger.com/vps-hosting',
      completed: false,
    },
    {
      id: 'access',
      title: '2. Acessar VPS via SSH',
      description: 'Use o IP e senha fornecidos pelo Hostinger para conectar via SSH.',
      command: `ssh root@${vpsIp}`,
      completed: false,
    },
    {
      id: 'update',
      title: '3. Atualizar Sistema',
      description: 'Execute os comandos para atualizar o sistema.',
      command: 'sudo apt-get update && sudo apt-get upgrade -y',
      completed: false,
    },
    {
      id: 'install',
      title: '4. Instalar Dependências',
      description: 'Instale Docker e outras dependências necessárias.',
      command: 'sudo apt-get install -y docker.io docker-compose git ufw curl jq',
      completed: false,
    },
    {
      id: 'firewall',
      title: '5. Configurar Firewall',
      description: 'Configure o firewall para permitir portas necessárias.',
      command: 'sudo ufw allow ssh && sudo ufw allow 26656/tcp && sudo ufw allow 8081/tcp && sudo ufw --force enable',
      completed: false,
    },
    {
      id: 'download',
      title: '6. Baixar Script de Setup',
      description: 'Baixe e execute o script de configuração do nó POKT.',
      command: 'curl -fsSL https://raw.githubusercontent.com/pokt-network/pokt-node-docker/main/setup.sh | bash',
      completed: false,
    },
    {
      id: 'configure',
      title: '7. Configurar Nó',
      description: 'Configure as chains e carteira do seu nó.',
      completed: false,
    },
    {
      id: 'start',
      title: '8. Iniciar Nó',
      description: 'Inicie o nó e verifique se está funcionando.',
      command: 'docker-compose up -d',
      completed: false,
    },
  ];

  const copyCommand = async (command: string) => {
    try {
      await Clipboard.setStringAsync(command);
      Alert.alert('Sucesso', 'Comando copiado para a área de transferência!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao copiar o comando');
    }
  };

  const markStepCompleted = (stepId: string) => {
    // In a real app, this would update state or backend
    Alert.alert('Passo Concluído', `Marcando "${setupSteps.find(s => s.id === stepId)?.title}" como concluído.`);
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Server size={32} color="#60A5FA" />
          <Text style={styles.title}>Configuração VPS Hostinger</Text>
          <Text style={styles.subtitle}>Guia passo a passo para implementar nó RPC POKT</Text>
        </View>

        <View style={styles.vpsConfig}>
          <Text style={styles.configTitle}>Configurações do VPS</Text>
          <TextInput
            style={styles.input}
            placeholder="IP do VPS (ex: 123.456.789.0)"
            placeholderTextColor="#9CA3AF"
            value={vpsIp}
            onChangeText={setVpsIp}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha do VPS"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={vpsPassword}
            onChangeText={setVpsPassword}
          />
        </View>

        <View style={styles.stepsContainer}>
          {setupSteps.map((step, index) => (
            <View key={step.id} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => markStepCompleted(step.id)}
                >
                  <CheckCircle size={20} color={step.completed ? '#10B981' : '#6B7280'} />
                </TouchableOpacity>
              </View>

              {step.command && (
                <View style={styles.commandContainer}>
                  <Text style={styles.commandText}>{step.command}</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyCommand(step.command!)}
                  >
                    <Copy size={16} color="#60A5FA" />
                  </TouchableOpacity>
                </View>
              )}

              {step.link && (
                <TouchableOpacity
                  style={styles.linkContainer}
                  onPress={() => openLink(step.link!)}
                >
                  <ExternalLink size={16} color="#60A5FA" />
                  <Text style={styles.linkText}>Acessar Link</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.warningCard}>
          <AlertTriangle size={24} color="#F59E0B" />
          <Text style={styles.warningTitle}>Importante</Text>
          <Text style={styles.warningText}>
            • Mantenha suas chaves privadas seguras{'\n'}
            • Monitore regularmente o status do nó{'\n'}
            • Faça backup das configurações{'\n'}
            • Consulte a documentação oficial para atualizações
          </Text>
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
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  vpsConfig: {
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  stepsContainer: {
    paddingHorizontal: 20,
  },
  stepCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  completeButton: {
    padding: 4,
  },
  commandContainer: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commandText: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#60A5FA',
  },
  copyButton: {
    padding: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  linkText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#60A5FA',
  },
  warningCard: {
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 12,
    lineHeight: 20,
  },
});