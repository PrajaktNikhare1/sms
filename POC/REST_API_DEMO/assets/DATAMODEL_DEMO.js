var datasetCreator ={
	"name": "REST API DEMO",
	"tables": [
		{
			"data": "Select file to insert data here",
			"name": "BUDGET_TABLE",
			"columnHeaders": [
				{
					"name": "Advertiser_ID",
					"dataType": "DOUBLE"
				},
				{
					"name": "Advertiser_Name",
					"dataType": "String"
				},
				{
					"name": "Agency_ID",
					"dataType": "DOUBLE"
				},
				{
					"name": "Agency_Name",
					"dataType": "String"
				},
				{
					"name": "Property_ID",
					"dataType": "DOUBLE"
				},
				{
					"name": "Property_Name",
					"dataType": "String"
				},
				{
					"name": "Budget",
					"dataType": "DOUBLE"
				}
			]
		}
	],
	"metrics": [
		
		{
			"name": "Budget",
			"dataType": "number",
			"expressions": [
				{
					"formula": "BUDGET_TABLE.Budget"
				}
			]
		}
	],
	"attributes": [
		{
			"name": "Advertiser",
			"attributeForms": [
				{
					"category": "ID",
					"expressions": [
						{
							"formula": "BUDGET_TABLE.Advertiser_ID"
						}
					],
					"dataType": "Number"
				},
				{
					"category": "Desc",
					"expressions": [
						{
							"formula": "BUDGET_TABLE.Advertiser_Name"
						}
					],
					"dataType": "String"
				}	
			]
		},
		{
			"name": "Agency",
			"attributeForms": [
				{
					"category": "ID",
					"expressions": [
						{
							"formula": "BUDGET_TABLE.Agency_ID"
						}
					],
					"dataType": "Number"
				},
				{
					"category": "Desc",
					"expressions": [
						{
							"formula": "BUDGET_TABLE.Agency_Name"
						}
					],
					"dataType": "String"
				}
			]
		},
		{
			"name": "Property",
			"attributeForms": [
				{
					"category": "ID",
					"expressions": [
						{
							"formula": "BUDGET_TABLE.Property_ID"
						}
					],
					"dataType": "Number"
				},
				{
					"category": "Desc",
					"expressions": [
						{
							"formula": "BUDGET_TABLE.Property_Name"
						}
					],
					"dataType": "String"
				}
			]
		}
	]
}