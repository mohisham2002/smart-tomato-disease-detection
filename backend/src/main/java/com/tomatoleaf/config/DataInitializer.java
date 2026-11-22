package com.tomatoleaf.config;

import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@gmail.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("Admin123"));
                admin.setRole(User.UserRole.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("Admin user created: admin@gmail.com / Admin123");
            }
        };
    }
}
