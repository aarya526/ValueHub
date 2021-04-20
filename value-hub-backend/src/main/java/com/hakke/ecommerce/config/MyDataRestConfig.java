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

import com.hakke.ecommerce.model.Country;
import com.hakke.ecommerce.model.Product;
import com.hakke.ecommerce.model.ProductCategory;
import com.hakke.ecommerce.model.State;

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

		disableHttpMethods(Product.class, config, unSupportedActions);
		disableHttpMethods(ProductCategory.class, config, unSupportedActions);
		disableHttpMethods(Country.class, config, unSupportedActions);
		disableHttpMethods(State.class, config, unSupportedActions);

		// call an internal helper method to expose id of categories
		exposeIds(config);
	}

	private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
			HttpMethod[] unSupportedActions) {
		// disable Http Methods for Entity Classes: PUT, POST and delete
		config.getExposureConfiguration().forDomainType(theClass)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedActions));
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
