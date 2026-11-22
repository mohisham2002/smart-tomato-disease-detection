package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final NotificationRepository notificationRepository;
    private final DetectionHistoryRepository detectionHistoryRepository;
    private final LeafImageRepository leafImageRepository;
    private final FeedbackRepository feedbackRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService,
                       NotificationRepository notificationRepository,
                       DetectionHistoryRepository detectionHistoryRepository,
                       LeafImageRepository leafImageRepository,
                       FeedbackRepository feedbackRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.notificationRepository = notificationRepository;
        this.detectionHistoryRepository = detectionHistoryRepository;
        this.leafImageRepository = leafImageRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional
    public UserDTO createUser(CreateUserRequestDTO request) {
        logger.info("Creating new user with email: {}", request.email());

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists: " + request.email());
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(User.UserRole.USER);
        user.setActive(true);

        User savedUser = userRepository.save(user);
        logger.info("User created successfully with id: {}", savedUser.getId());

        return UserDTO.fromEntity(savedUser);
    }

    @Transactional
    public UserDTO createAdmin(CreateUserRequestDTO request) {
        logger.info("Creating new admin with email: {}", request.email());

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists: " + request.email());
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(User.UserRole.ADMIN);
        user.setActive(true);

        User savedUser = userRepository.save(user);
        logger.info("Admin created successfully with id: {}", savedUser.getId());

        return UserDTO.fromEntity(savedUser);
    }

    public UserDTO getUserById(Long id) {
        logger.debug("Fetching user by id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return UserDTO.fromEntity(user);
    }

    public UserDTO getUserByEmail(String email) {
        logger.debug("Fetching user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return UserDTO.fromEntity(user);
    }

    public List<UserDTO> getAllUsers() {
        logger.debug("Fetching all active users");
        return userRepository.findByActiveTrue().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllUsersIncludingInactive() {
        logger.debug("Fetching all users including inactive");
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(User.UserRole role) {
        logger.debug("Fetching users by role: {}", role);
        return userRepository.findByRole(role).stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequestDTO request) {
        logger.info("Updating user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }

        User savedUser = userRepository.save(user);
        logger.info("User updated successfully: {}", savedUser.getId());

        return UserDTO.fromEntity(savedUser);
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequestDTO request) {
        logger.info("Changing password for user id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        logger.info("Password changed successfully for user id: {}", id);
    }

    @Transactional
    public UserDTO deactivateUser(Long id) {
        logger.info("Deactivating user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        user.setActive(false);
        User savedUser = userRepository.save(user);
        logger.info("User deactivated successfully: {}", savedUser.getId());

        return UserDTO.fromEntity(savedUser);
    }

    @Transactional
    public UserDTO activateUser(Long id) {
        logger.info("Activating user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        user.setActive(true);
        User savedUser = userRepository.save(user);
        logger.info("User activated successfully: {}", savedUser.getId());

        return UserDTO.fromEntity(savedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        logger.info("Deleting user with id: {}", id);
        
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
            
            feedbackRepository.deleteByUser(user);
            notificationRepository.deleteByUser(user);
            detectionHistoryRepository.deleteByUser(user);
            leafImageRepository.deleteByUser(user);
            
            userRepository.delete(user);
            logger.info("User deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting user: ", e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        logger.info("User login attempt for email: {}", request.email());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new IllegalArgumentException("Incorrect email or password"));

            if (!user.getActive()) {
                throw new IllegalArgumentException("Account is deactivated");
            }

            String token = jwtService.generateToken(user);
            logger.info("User logged in successfully: {}", user.getId());

            return new LoginResponseDTO(token, UserDTO.fromEntity(user));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            logger.warn("Invalid credentials attempt for email: {}", request.email());
            throw new IllegalArgumentException("Incorrect email or password");
        } catch (org.springframework.security.authentication.DisabledException e) {
            logger.warn("Disabled account login attempt for email: {}", request.email());
            throw new IllegalArgumentException("Account is deactivated");
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserDTO getCurrentUserDTO() {
        return UserDTO.fromEntity(getCurrentUser());
    }
}
