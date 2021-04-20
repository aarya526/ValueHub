package com.hakke.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hakke.ecommerce.dao.CustomerRepository;
import com.hakke.ecommerce.dto.Purchase;
import com.hakke.ecommerce.dto.PurchaseResponse;
import com.hakke.ecommerce.model.Customer;
import com.hakke.ecommerce.model.Order;
import com.hakke.ecommerce.model.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService {

	@Autowired
	private CustomerRepository customerRepository;

	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {

		// retrieve the order info from dto
		Order order = purchase.getOrder();

		// generate tracking number
		String orderTrackingNumber = generateOrderTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);

		// populate order with orderitems
		Set<OrderItem> orderItems = purchase.getOrderItems();
		orderItems.forEach(item -> order.add(item));

		// populate order with billingadrress and shipping address

		order.setBillingAddress(purchase.getBillingAddress());
		order.setShippingAddress(purchase.getShippingAddress());

		// populate customer with order
		Customer customer = purchase.getCustomer();
		customer.add(order);
		// save to database

		customerRepository.save(customer);

		// return a response
		return new PurchaseResponse(orderTrackingNumber);
	}

	public String generateOrderTrackingNumber() {

		// generate a random UUID number
		return UUID.randomUUID().toString();

	}

}
