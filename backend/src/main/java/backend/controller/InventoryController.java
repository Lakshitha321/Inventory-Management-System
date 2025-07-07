package backend.controller;

import backend.exception.InventoryNotFoundException;
import backend.model.InvetoryModel;
import backend.repository.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.sql.SQLOutput;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    private final String UPLOAD_DIR = "src/main/resources/uploads/";

    // Create item (no image)
    @PostMapping("/inventory")
    public InvetoryModel newInventoryModel(@RequestBody InvetoryModel newInventoryModel) {
        return inventoryRepository.save(newInventoryModel);
    }

    // Upload image only
    @PostMapping("/inventory/itemImg")
    public ResponseEntity<Map<String, String>> itemImage(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            file.transferTo(Paths.get(UPLOAD_DIR + fileName));
            return ResponseEntity.ok(Map.of("fileName", fileName));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Image upload failed"));
        }
    }

    // Get all items
    @GetMapping("/inventory")
    public List<InvetoryModel> getAllItems() {
        return inventoryRepository.findAll();
    }

    // Get item by ID
    @GetMapping("/inventory/{id}")
    public InvetoryModel getItemById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException(id));
    }

    // Serve uploaded image
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    // PUT: JSON only (no new file uploaded)
    @PutMapping(value = "/inventory/{id}", consumes = "application/json")
    public InvetoryModel updateItemJson(@RequestBody InvetoryModel newInventory, @PathVariable Long id) {
        return inventoryRepository.findById(id).map(existingInventory -> {
            existingInventory.setItemId(newInventory.getItemId());
            existingInventory.setItemName(newInventory.getItemName());
            existingInventory.setItemCategory(newInventory.getItemCategory());
            existingInventory.setItemQty(newInventory.getItemQty());
            existingInventory.setItemDetails(newInventory.getItemDetails());
            return inventoryRepository.save(existingInventory);
        }).orElseThrow(() -> new InventoryNotFoundException(id));
    }

    // PUT: Multipart with optional file
    @PutMapping(value = "/inventory/{id}", consumes = "multipart/form-data")
    public InvetoryModel updateItemMultipart(
            @RequestPart("itemdetails") String itemDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable Long id
    ) {
        ObjectMapper mapper = new ObjectMapper();
        InvetoryModel newInventory;

        try {
            newInventory = mapper.readValue(itemDetails, InvetoryModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing item details JSON", e);
        }

        return inventoryRepository.findById(id).map(existingInventory -> {
            existingInventory.setItemId(newInventory.getItemId());
            existingInventory.setItemName(newInventory.getItemName());
            existingInventory.setItemCategory(newInventory.getItemCategory());
            existingInventory.setItemQty(newInventory.getItemQty());
            existingInventory.setItemDetails(newInventory.getItemDetails());

            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename();
                try {
                    file.transferTo(Paths.get(UPLOAD_DIR + fileName));
                    existingInventory.setItemImage(fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Error saving uploaded file", e);
                }
            }

            return inventoryRepository.save(existingInventory);
        }).orElseThrow(() -> new InventoryNotFoundException(id));
    }
    // Delete item by ID (including image if exists)
    @DeleteMapping("/inventory/{id}")
    public String deleteItem(@PathVariable Long id) {
        // Check if the item exists
        InvetoryModel InventoryItem = inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException(id));

        // Delete image if it exists
        String itemImage = InventoryItem.getItemImage();
        if (itemImage != null && !itemImage.isEmpty()) {
            File imageFile = new File(UPLOAD_DIR + itemImage);
            if (imageFile.exists()) {
                if (imageFile.delete()) {
                    System.out.println("Image deleted");
                } else {
                    System.out.println("Failed to delete image");
                }
            }
        }

        // Delete item from repository
        inventoryRepository.deleteById(id);
        return "Data with ID " + id + " and its image (if any) deleted successfully.";
    }


}
