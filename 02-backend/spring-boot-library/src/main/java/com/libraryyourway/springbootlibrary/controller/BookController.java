package com.libraryyourway.springbootlibrary.controller;

import com.libraryyourway.springbootlibrary.entity.Book;
import com.libraryyourway.springbootlibrary.service.BookService;
import com.libraryyourway.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    BookService bookService;
    @GetMapping("/secure/currentloans/count")
    public int currentLoanCount(@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoanCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser/")
    public Boolean checkedOutByUser(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.bookCheckedOutByUser(userEmail, bookId);
    }



    @PutMapping("/secure/checkout/")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
       return bookService.checkoutBook(userEmail, bookId );


    }


}
