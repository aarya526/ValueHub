package com.hakke.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.hakke.ecommerce.model.Product;
import com.hakke.ecommerce.model.ProductCategory;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	private EntityManager entityManager;

	@Autowired
	public MyDataRestConfig(EntityManager entityManager) {
		// TODO Auto-generated constructor stub
		this.entityManager = entityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

		HttpMethod[] unSupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE };

		config.getExposureConfiguration().forDomainType(Product.class)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedActions));

		config.getExposureConfiguration().forDomainType(ProductCategory.class)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedActions));

		// call an internal helper method to expose id of categories
		exposeIds(config);
	}

	private void exposeIds(RepositoryRestConfiguration config) {

		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

		List<Class> entityClasses = new ArrayList<Class>();

		for (EntityType tempEntityType : entities) {

			entityClasses.add(tempEntityType.getJavaType());

		}
		
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);

	}

}
