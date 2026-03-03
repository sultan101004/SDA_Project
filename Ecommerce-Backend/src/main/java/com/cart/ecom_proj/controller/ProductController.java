package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

    @Value("${app.upload.dir:uploads/images}")
    private String uploadDir;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false, defaultValue = "false") boolean withImages,
            @RequestParam(required = false, defaultValue = "false") boolean withoutImages){
        
        List<Product> products = service.getAllProducts();
        
        // Filter based on query parameters
        if (withImages) {
            products = products.stream()
                    .filter(p -> p.getImagePath() != null && !p.getImagePath().isEmpty())
                    .collect(Collectors.toList());
        } else if (withoutImages) {
            products = products.stream()
                    .filter(p -> p.getImagePath() == null || p.getImagePath().isEmpty())
                    .collect(Collectors.toList());
        }
        
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable int id){

        Product product = service.getProductById(id);

        if(product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {

        try {
            System.out.println(product);
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){

        Product product = service.getProductById(productId);
        
        // First try to get image from file system using imagePath
        if (product != null && product.getImagePath() != null && !product.getImagePath().isEmpty()) {
            try {
                String filename = product.getImagePath().substring(product.getImagePath().lastIndexOf("/") + 1);
                Path path = Paths.get(uploadDir, filename);
                if (Files.exists(path)) {
                    byte[] imageBytes = Files.readAllBytes(path);
                    String contentType = product.getImageType();
                    if (contentType == null || contentType.isEmpty()) {
                        contentType = "image/jpeg";
                    }
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .body(imageBytes);
                }
            } catch (IOException e) {
                System.err.println("Error reading image file: " + e.getMessage());
            }
        }
        
        // Fallback to BLOB data if exists
        if (product != null && product.getImageDate() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(product.getImageType("image/jpeg")))
                    .body(product.getImageDate());
        }
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id,
                                                @RequestPart Product product,
                                                @RequestPart MultipartFile imageFile){

        Product product1 = null;
        try {
            product1 = service.updateProduct(id, product, imageFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if (product1 != null)
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        else
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);

    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        Product product = service.getProductById(id);
        if(product != null) {
            service.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "false") boolean withImages,
            @RequestParam(required = false, defaultValue = "false") boolean withoutImages){
        
        System.out.println("searching with " + keyword);
        List<Product> products = service.searchProducts(keyword);
        
        // Filter based on query parameters
        if (withImages) {
            products = products.stream()
                    .filter(p -> p.getImagePath() != null && !p.getImagePath().isEmpty())
                    .collect(Collectors.toList());
        } else if (withoutImages) {
            products = products.stream()
                    .filter(p -> p.getImagePath() == null || p.getImagePath().isEmpty())
                    .collect(Collectors.toList());
        }
        
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
