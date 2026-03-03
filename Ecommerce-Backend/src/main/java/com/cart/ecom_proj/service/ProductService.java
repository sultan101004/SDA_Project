package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    @Value("${app.upload.dir:uploads/images}")
    private String uploadDir;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        // Set image metadata
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        
        // Save image to file system
        String imagePath = saveImageToFileSystem(imageFile);
        product.setImagePath(imagePath);
        
        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        Product existingProduct = repo.findById(id).orElse(null);
        if (existingProduct == null) {
            return null;
        }
        
        // Update basic fields
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setReleaseDate(product.getReleaseDate());
        existingProduct.setProductAvailable(product.isProductAvailable());
        existingProduct.setStockQuantity(product.getStockQuantity());
        
        // If new image provided, save to file system
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image if exists
            if (existingProduct.getImagePath() != null) {
                deleteImageFromFileSystem(existingProduct.getImagePath());
            }
            
            // Save new image
            String imagePath = saveImageToFileSystem(imageFile);
            existingProduct.setImagePath(imagePath);
            existingProduct.setImageName(imageFile.getOriginalFilename());
            existingProduct.setImageType(imageFile.getContentType());
        }
        
        return repo.save(existingProduct);
    }

    public void deleteProduct(int id) {
        Product product = repo.findById(id).orElse(null);
        if (product != null && product.getImagePath() != null) {
            deleteImageFromFileSystem(product.getImagePath());
        }
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
    
    // Helper method to save image to file system
    private String saveImageToFileSystem(MultipartFile imageFile) throws IOException {
        // Create upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Generate unique filename to avoid conflicts
        String originalFilename = imageFile.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        
        // Save file
        Path path = Paths.get(uploadDir, uniqueFilename);
        Files.copy(imageFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        
        // Return relative path that can be served via URL
        return "/uploads/images/" + uniqueFilename;
    }
    
    // Helper method to delete image from file system
    private void deleteImageFromFileSystem(String imagePath) {
        try {
            if (imagePath != null) {
                // Extract filename from path
                String filename = imagePath.substring(imagePath.lastIndexOf("/") + 1);
                Path path = Paths.get(uploadDir, filename);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }
}
