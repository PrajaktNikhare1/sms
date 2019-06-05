
  CREATE OR REPLACE FORCE EDITIONABLE VIEW "SMSDBO"."ATP_CATEGORY" ("PROPERTY_ID", "DEFAULT_CATEGORY_ID", "CAT_PROP_DOLLARS", "CAT_DOLLARS", "CAT_PROP_PCT") AS 
  SELECT DISTINCT property_id,
                default_category_id, 
                Sum(sales_dollars) OVER (partition BY property_id, default_category_id)                                                              CAT_PROP_DOLLARS,
                Sum(sales_dollars) OVER (partition BY default_category_id)                                                                           CAT_DOLLARS,
                Sum(sales_dollars) OVER (partition BY property_id, default_category_id) / Sum(sales_dollars) OVER (partition BY default_category_id) CAT_PROP_PCT
FROM            external_deal ed 
JOIN            external_deal_detail edd 
ON              ed.external_deal_id = edd.external_deal_id 
JOIN            advertiser ad 
ON              ed.advertiser_id = ad.advertiser_id 
WHERE           edd.business_type_id = 1 
AND             ed.src_deal_type_id = 5 
AND             ed.budget_year_id IN (select BUDGET_YEAR_ID from ATP_BUDGET_YEAR where DEFAULT_BUDGET_YEAR <> 1);
