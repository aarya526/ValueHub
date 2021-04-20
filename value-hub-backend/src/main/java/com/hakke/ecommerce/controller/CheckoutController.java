package com.hakke.ecommerce.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hakke.ecommerce.dto.Purchase;
import com.hakke.ecommerce.dto.PurchaseResponse;
import com.hakke.ecommerce.service.CheckoutService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

	private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);
	@Autowired
	private CheckoutService checkoutService;

	@RequestMapping("/purchase")
	private PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
		PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
		log.info(purchaseResponse.toString());
		return purchaseResponse;
	}

}
