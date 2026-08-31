# Stage 1: Build Angular app
FROM node:22.23.2 AS node_builder

WORKDIR /app/webapp

# Copy package.json and install dependencies
COPY webapp/package*.json ./
RUN npm install

# Copy the rest of the Angular app and build
COPY webapp/ .
RUN npm run build -- --configuration production

# Stage 2: Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy solution and csproj, restore
COPY *.sln .
COPY webappTemplate/*.csproj ./webappTemplate/
RUN dotnet restore

# Copy the rest of the project
COPY . .

# Copy built Angular files into the ASP.NET Core wwwroot
COPY --from=node_builder /app/webapp/dist/webapp/browser ./webappTemplate/wwwroot/

# Publish the .NET app
RUN dotnet publish -c Release -o out

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "gs.dll"]
