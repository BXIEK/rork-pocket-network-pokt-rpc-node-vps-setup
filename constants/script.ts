export const poktSetupScript = `#!/bin/bash
#################################################################################
# Script de Configuração Automatizada para Nó Pocket Network com Docker         #
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
sudo apt-get install -y docker.io docker-compose git ufw

print_step "PASSO 2: CONFIGURANDO O FIREWALL"
sudo ufw allow ssh
sudo ufw allow 26656/tcp
sudo ufw --force enable

print_step "PASSO 3: ADICIONANDO USUÁRIO AO GRUPO DOCKER"
sudo usermod -aG docker \$USER

print_step "PASSO 4: CLONANDO O REPOSITÓRIO OFICIAL"
git clone https://github.com/pokt-network/pokt-node-docker.git
cd pokt-node-docker

print_step "PASSO 5: CONFIGURANDO ENDPOINTS RPC"
echo "Insira seus endpoints RPC:"
read -p "Ethereum (0021): " ETH_RPC_URL
read -p "Polygon (0009): " POLY_RPC_URL

cat <<EOF > pokt-configs/chains.json
[
  {
    "id": "0021",
    "url": "\$ETH_RPC_URL"
  },
  {
    "id": "0009",
    "url": "\$POLY_RPC_URL"
  }
]
EOF

print_step "PASSO 6: CRIANDO CARTEIRA"
docker-compose run --rm pokt-core --datadir=/home/app/.pokt keys add my-node-wallet

print_step "PASSO 7: INICIANDO NÓ"
docker-compose up -d

print_step "CONFIGURAÇÃO CONCLUÍDA"
echo "Próximos passos manuais: financiar carteira e fazer stake."`;