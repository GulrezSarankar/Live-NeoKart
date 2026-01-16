# ---------- Build Stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- Run Stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built jar
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot port (Render uses $PORT)
EXPOSE 8080

# Run application
CMD ["java", "-jar", "app.jar"]
