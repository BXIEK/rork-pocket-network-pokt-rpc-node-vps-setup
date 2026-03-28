export const poktSetupScript = `#!/bin/bash
#################################################################################
# Script de Configuração Automatizada para Nó RPC Pocket Network com Docker     #
# Baseado na documentação oficial mais atualizada: https://docs.pokt.network/   #
#################################################################################
set -e

print_step() {
    echo "  "
    echo "========================================================"
    echo "  \$1"
    echo "========================================================"
    echo "  "
}

print_step "PASSO 1: ATUALIZANDO O SERVIDOR E INSTALANDO DEPENDÊNCIAS"
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y docker.io docker-compose git ufw curl jq

print_step "PASSO 2: CONFIGURANDO O FIREWALL"
sudo ufw allow ssh
sudo ufw allow 26656/tcp  # P2P
sudo ufw allow 8081/tcp   # RPC
sudo ufw --force enable

print_step "PASSO 3: ADICIONANDO USUÁRIO AO GRUPO DOCKER"
sudo usermod -aG docker \$USER

print_step "PASSO 4: CLONANDO O REPOSITÓRIO OFICIAL"
git clone https://github.com/pokt-network/pokt-node-docker.git
cd pokt-node-docker

print_step "PASSO 5: CONFIGURANDO CHAINS SUPORTADAS"
# Configuração baseada na documentação oficial
cat <<EOF > pokt-configs/chains.json
[
  {
    "id": "0021",
    "url": "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
  },
  {
    "id": "0009",
    "url": "https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
  },
  {
    "id": "0003",
    "url": "https://mainnet.infura.io/v3/YOUR_PROJECT_ID"
  }
]
EOF

print_step "PASSO 6: CRIANDO CARTEIRA"
docker-compose run --rm pokt-core --datadir=/home/app/.pokt keys add my-node-wallet

print_step "PASSO 7: CONFIGURANDO VARIÁVEIS DE AMBIENTE"
# Gere uma senha segura para a carteira
WALLET_PASSWORD=\$(openssl rand -base64 32)
echo "WALLET_PASSWORD=\$WALLET_PASSWORD" > .env

print_step "PASSO 8: INICIANDO NÓ RPC"
docker-compose up -d

print_step "PASSO 9: VERIFICANDO STATUS"
sleep 30
curl -X POST http://localhost:8081/v1/query/height

print_step "CONFIGURAÇÃO CONCLUÍDA"
echo "✅ Nó RPC Pocket Network configurado com sucesso!"
echo "📝 Próximos passos:"
echo "1. Financie sua carteira com POKT tokens"
echo "2. Faça stake do seu nó via Pocket Portal"
echo "3. Monitore o status através do app"
echo ""
echo "🔗 Documentação: https://docs.pokt.network/node-runners/"`;