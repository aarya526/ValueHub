package com.hakke.ecommerce.service;

import com.hakke.ecommerce.dto.Purchase;
import com.hakke.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);

}
