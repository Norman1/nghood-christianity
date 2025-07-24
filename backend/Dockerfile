# Build stage
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app

# Copy pom.xml first for better Docker layer caching
COPY pom.xml .

# Download dependencies - this layer is cached if pom.xml hasn't changed
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Health check commented out for now (requires curl installation)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#   CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]