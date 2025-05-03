package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${jwt.secret}")
    private String jwtSecret;

    public User registerUser(User user) {
        Optional<User> existing = userRepository.findByEmailIgnoreCase(user.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("Email already in use.");
        }

        System.out.println("Raw password before encoding: " + user.getPassword());

        String encoded = passwordEncoder.encode(user.getPassword());
        System.out.println("Encoded password: " + encoded);
        user.setPassword(encoded);

        return userRepository.save(user);
    }

    public String authenticate(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            System.out.println("Authenticating user: " + email);
            System.out.println("Entered raw password: " + rawPassword);
            System.out.println("Stored hashed password: " + user.getPassword());
            System.out.println("Password match result: " + passwordEncoder.matches(rawPassword, user.getPassword()));

            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                System.out.println("Password matched successfully!");
                return generateToken(email);
            } else {
                System.out.println("Password did NOT match!");
            }
        } else {
            System.out.println("No user found with email: " + email);
        }

        throw new RuntimeException("Invalid credentials!");
    }

    public String generateToken(String email) {
        long expirationTime = 1000 * 60 * 60 * 10;

        return Jwts.builder()
                .setSubject(email)
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public ResponseEntity<String> updateSection(String email, User updatedInfo, String section) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        User user = userOpt.get();

        switch (section.toLowerCase()) {
            case "personal":
                user.setFullName(updatedInfo.getFullName());
                user.setDob(updatedInfo.getDob());
                user.setContactEmail(updatedInfo.getContactEmail());
                user.setPhone(updatedInfo.getPhone());
                user.setLocation(updatedInfo.getLocation());
                user.setPreferredLanguages(updatedInfo.getPreferredLanguages());
                break;
            case "education":
                user.setEducationLevel(updatedInfo.getEducationLevel());
                user.setInstitutionName(updatedInfo.getInstitutionName());
                user.setMajor(updatedInfo.getMajor());
                user.setGraduationDate(updatedInfo.getGraduationDate());
                user.setGpa(updatedInfo.getGpa());
                user.setAchievements(updatedInfo.getAchievements());
                user.setCoursework(updatedInfo.getCoursework());
                user.setAcademicCertifications(updatedInfo.getAcademicCertifications());
                break;
            case "aspirations":
                user.setCareerInterests(updatedInfo.getCareerInterests());
                user.setIndustrySectors(updatedInfo.getIndustrySectors());
                user.setShortTermGoals(updatedInfo.getShortTermGoals());
                user.setLongTermGoals(updatedInfo.getLongTermGoals());
                user.setDreamJob(updatedInfo.getDreamJob());
                break;
            case "skills":
                user.setProgrammingLanguages(updatedInfo.getProgrammingLanguages());
                user.setSoftwareSkills(updatedInfo.getSoftwareSkills());
                user.setTechCertifications(updatedInfo.getTechCertifications());
                user.setSkillLevels(updatedInfo.getSkillLevels());
                user.setSoftSkills(updatedInfo.getSoftSkills());
                break;
            case "experience":
                user.setWorkExperience(updatedInfo.getWorkExperience());
                break;
            case "networking":
                user.setLinkedin(updatedInfo.getLinkedin());
                user.setGithub(updatedInfo.getGithub());
                user.setOtherSocial(updatedInfo.getOtherSocial());
                user.setWebsite(updatedInfo.getWebsite());
                break;
            default:
                return new ResponseEntity<>("Invalid section", HttpStatus.BAD_REQUEST);
        }

        userRepository.save(user);
        return new ResponseEntity<>("Profile updated successfully!", HttpStatus.OK);
    }

    // Authenticate and return full profile if valid
    public User authenticateAndFetchProfile(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            System.out.println("Authenticating user for profile fetch: " + email);
            System.out.println("Entered raw password: " + rawPassword);
            System.out.println("Stored hashed password: " + user.getPassword());
            System.out.println("Match result: " + passwordEncoder.matches(rawPassword, user.getPassword()));

            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                user.setPassword(null); // Remove password for security
                return user;
            } else {
                System.out.println("Password did NOT match for profile fetch.");
            }
        } else {
            System.out.println("No user found with email: " + email);
        }

        throw new RuntimeException("Invalid email or password for profile fetch!");
    }
}
