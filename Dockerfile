# =========================================================
# STAGE 1 — BUILD ANGULAR
# =========================================================

FROM node:22.23.2 AS node_builder

WORKDIR /app/webapp

# Install dependencies first for better Docker caching
COPY webapp/package*.json ./

RUN npm ci

# Copy Angular application
COPY webapp/ ./

# package.json already specifies production configuration
RUN npm run build


# =========================================================
# STAGE 2 — BUILD / PUBLISH .NET
# =========================================================

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Restore dependencies separately for better caching
COPY *.sln ./
COPY webappTemplate/*.csproj ./webappTemplate/

RUN dotnet restore

# Copy entire application
COPY . .

# Copy Angular production build into ASP.NET wwwroot
COPY --from=node_builder \
  /app/webapp/dist/webapp/browser \
  ./webappTemplate/wwwroot/

# Publish ASP.NET application
RUN dotnet publish \
  ./webappTemplate/webappTemplate.csproj \
  -c Release \
  -o /app/out \
  --no-restore


# =========================================================
# STAGE 3 — RUNTIME
# =========================================================

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://0.0.0.0:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "webappTemplate.dll"]