package com.libraryyourway.springbootlibrary.controller;

import com.libraryyourway.springbootlibrary.entity.Book;
import com.libraryyourway.springbootlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    BookService bookService;
    @GetMapping("/secure/currentloans/count")
    public int currentLoanCount() throws Exception {
        String userEmail = "testuser@email.com";
        return bookService.currentLoanCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkedOutByUser(@RequestParam Long bookId) throws Exception {
        String userEmail = "testuser@email.com";
        return bookService.bookCheckedOutByUser(userEmail, bookId);
    }



    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception {
        String userEmail = "testuser@email.com";
       return bookService.checkoutBook(userEmail, bookId );


    }


}
