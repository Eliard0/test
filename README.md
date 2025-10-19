Este projeto foi desenvolvido como parte de um **teste técnico**, implementando um sistema com **Laravel 10 + Vue 3 (Vite)**, orquestrado via **Docker Compose**.  
O sistema oferece CRUDs, exportações em **Excel/PDF** e **relatórios analíticos**.

## 🧱 Tecnologias Utilizadas

### 🖥️ Backend
- **Laravel 10**
- **PHP 8.2**
- **PostgreSQL 15**
- **Maatwebsite/Excel** → exportação `.xlsx`
- **Barryvdh/DomPDF** → exportação `.pdf`

### 💻 Frontend
- **Vue 3 + Vite + TypeScript**
- **PrimeVue** (componentes UI)
- **TailwindCSS**
- **Axios** (requisições à API)

### 🐳 Infraestrutura
- **Docker + Docker Compose**
- Containers:
  - `app` → PHP/Laravel
  - `node` → Vite/Frontend
  - `nginx` → Servidor web
  - `db` → PostgreSQL
  - `pgadmin` → Interface do banco

---

## ⚙️ 1. Pré-requisitos

Certifique-se de ter instalado:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/downloads)

## 📦 2. Clone o repositorio para sua maquina

Ultilize o comando para clonar o repositorio:

git clone https://github.com/Eliard0/test.git

## 📦 3. Abra o arquivo do projeto em seu editor de codigo e abra o terminal integrado

## 🐳 4. Subir os Containers

docker-compose up --build -d

## 📦 5. Configuração do Laravel

Abra o terminal e acesse o container app com esse comando:

docker exec -it agro-app bash

logo apos entre dentro da pasta application com o comando:

cd application 

dentro dessa pasta rode o comando para carregar todos os arquivos do laravel:

composer install 

## 🗄️ 6. Gerando nossa api key

Ainda dentro do container agro-app rode o comando:

Crie uma cópia do arquivo .env.example e renomeie-a para .env e use o comando:

php artisan key:generate

apos a APP_KEY gerada dentro arquivo .env

copie e cole ela dentro do arquivo docker-compose.yml, na parte de environment do container app

depois volta para a raiz do projeto e recontrua os containers novamente com o comando:

docker-compose up --build -d

## 🗄️ 7. Configurando banco de dados

configure o arquivo .env para usa o banco de dados postgress

DB_CONNECTION=pgsql
DB_HOST=db             
DB_PORT=5432
DB_DATABASE=test   
DB_USERNAME=postgres   
DB_PASSWORD=postgres

## 🗄️ 8. Rodar Migrations e Seeders

se voce estiver na raiz do projeto entre dentro do container agro-app com o comando:

docker exec -it agro-app bash e execulte o comando para roda as migrations

php artisan migrate

## 🌐 9. Acesso aos Serviços

| Serviço | Descrição | URL |
|----------|------------|------|
| **Aplicação | Laravel + Vue | [http://localhost:8000](http://localhost:8000) |
| **PgAdmin** | Interface do banco | [http://localhost:5050](http://localhost:5050) |

**Credenciais PgAdmin:**
```
Email: user@agro.com
Senha: agro100
```

**Banco configurado:**
```
Host: db
User: postgres
Password: postgres
Database: postgres

