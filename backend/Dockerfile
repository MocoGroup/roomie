FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app
RUN groupadd -r spring && useradd -r -g spring spring
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar
RUN mkdir -p /tmp/roomie/uploads && chown -R spring:spring /tmp/roomie
USER spring:spring
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
