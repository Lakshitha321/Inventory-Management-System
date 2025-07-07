package backend.controller;

import backend.exception.UserNotFoundExeption;
import backend.model.UserModel;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Create user
    @PostMapping("/user")
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {
        return userRepository.save(newUserModel);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundExeption("Email not found: " + loginDetails.getEmail()));

        if (user.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login Successful");
            response.put("userId", user.getId()); // ✅ Send userId
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid Credentials"));
        }
    }

    // Get all users
    @GetMapping("/user")
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    @GetMapping("/user/{id}")
    public UserModel getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundExeption("User not found with id: " + id));
    }

    @PutMapping("/user/{id}")
    UserModel updateProfile(@RequestBody UserModel newUserModel, @PathVariable Long id) {
        return userRepository.findById(id)
                .map(userModel -> {
                    userModel.setFullname(newUserModel.getFullname());
                    userModel.setEmail(newUserModel.getEmail());  // Corrected this line
                    userModel.setPassword(newUserModel.getPassword());
                    userModel.setPhone(newUserModel.getPhone());  // Corrected this line
                    return userRepository.save(userModel);
                })
                .orElseThrow(() -> new UserNotFoundExeption("User not found with id: " + id));  // Improved exception message
    }
    //delete
    @DeleteMapping("/user/{id}")
    String deleteProfile(@PathVariable Long id){
        if (!userRepository.existsById(id)){
            throw new UserNotFoundExeption(id);
        }
        userRepository.deleteById(id);
        return "user account" + id + "deleted";
    }
}