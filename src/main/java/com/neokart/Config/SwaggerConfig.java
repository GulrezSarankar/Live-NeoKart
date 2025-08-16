//package com.neokart.Config;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import io.swagger.v3.oas.models.Components;
//import io.swagger.v3.oas.models.OpenAPI;
//import io.swagger.v3.oas.models.info.Contact;
//import io.swagger.v3.oas.models.info.Info;
//import io.swagger.v3.oas.models.info.License;
//import io.swagger.v3.oas.models.security.SecurityRequirement;
//import io.swagger.v3.oas.models.security.SecurityScheme;
//
//@Configuration
//public class SwaggerConfig {
//
//
//    @Bean
//    public OpenAPI customOpenAPI() {
//        return new OpenAPI()
//                .info(new Info()
//                        .title("NeoKart E-commerce API")
//                        .version("1.0")
//                        .description("API documentation for NeoKart E-commerce project")
//                        .contact(new Contact()
//                                .name("Gulrez Shabir Sarankar")
//                                .email("techworld7865@gmail.com"))
//                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
//                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
//                .components(new Components()
//                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
//                                .name("bearerAuth")
//                                .type(SecurityScheme.Type.HTTP)
//                                .scheme("bearer")
//                                .bearerFormat("JWT")));
//    }
//}