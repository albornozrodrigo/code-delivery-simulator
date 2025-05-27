FROM node:20-alpine

RUN apk add --no-cache bash

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN pnpm install

# Copia o restante dos arquivos
COPY . .

# Compila TypeScript
RUN pnpm build

# Define a porta padrão (se for usar)
EXPOSE 3001

# Comando padrão
CMD ["tail", "-f", "/dev/null"]
