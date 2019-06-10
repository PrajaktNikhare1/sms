/**
 * MicroStrategy SDK Sample
 *
 * Copyright © 2011 MicroStrategy Incorporated. All Rights Reserved.
 *
* MICROSTRATEGY MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE 
 * SUITABILITY OF THIS SAMPLE CODE, EITHER EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS 
 * FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. MICROSTRATEGY SHALL NOT 
 * BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, 
 * MODIFYING OR DISTRIBUTING THIS SAMPLE CODE OR ITS DERIVATIVES.
 *
 *
 */

package com.GetReportDataTaskUserSession;

import com.microstrategy.utils.log.Level;
import com.microstrategy.web.app.tags.Log;
import com.microstrategy.web.app.tasks.architect.json.JSONObject;
import com.microstrategy.web.app.tasks.architect.json.XML;
import com.microstrategy.web.beans.MarkupOutput;
import com.microstrategy.web.beans.RequestKeys;
import com.microstrategy.web.objects.SimpleList;
import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectInfo;
import com.microstrategy.web.objects.WebObjectSource;
import com.microstrategy.web.objects.WebObjectsException;
import com.microstrategy.web.objects.WebObjectsFactory;
import com.microstrategy.web.objects.WebReportInstance;
import com.microstrategy.web.objects.WebReportSource;
import com.microstrategy.web.objects.WebSubscriptionsSource;
import com.microstrategy.web.tasks.AbstractBaseTask;
import com.microstrategy.web.tasks.TaskParameterMetadata;
import com.microstrategy.web.tasks.TaskRequestContext;
import com.microstrategy.webapi.EnumDSSXMLApplicationType;
import com.microstrategy.webapi.EnumDSSXMLObjectTypes;

public class GetReportDataTaskUserSession extends AbstractBaseTask  {
		
	private TaskParameterMetadata object_ID;
	private TaskParameterMetadata sessionState;

    public GetReportDataTaskUserSession() {
        super("Get the Report Data Task with User Session");
        // TODO Auto-generated method stub
        
        object_ID = addParameterMetadata("objectID", "Enter Report ID", true, "17824A7545F27370F29D00B9DD42FB4D");
        sessionState = addParameterMetadata("SessionState", "Enter valid session state.", true, "");
    }

    public void processRequest(TaskRequestContext context, MarkupOutput out) {
        // TODO Auto-generated method stub
        
     	//get Values from the request keys:
        RequestKeys keys = context.getRequestKeys();        
       
        String objectID = keys.getValue(object_ID.getName());        
        String sessionStateString = keys.getValue("SessionState");
        
        //out.append("Get the Report Data Task with User Session");        
        //out.append("\n object_ID : "+ object_ID + "\n");
        //out.append("\n sessionStateString: "+ sessionStateString + "\n");
        
       	String SessionID = "";
		//Restore session
		WebObjectsFactory objectFactory = WebObjectsFactory.getInstance();
		WebIServerSession serverSession = objectFactory.getIServerSession();
		//System.out.println("Sessionstate; " + sessionStateString);	
		
		try {
			// Restore the sessionStateString
			serverSession.restoreState(sessionStateString);
			System.out.println("MySessionID: " + serverSession.getSessionID().subSequence(0, 32));		
			serverSession.setApplicationType(EnumDSSXMLApplicationType.DssXmlApplicationCustomApp);        

		    try {

		     // Create the session
		        SessionID = serverSession.getSessionID();
		        //System.out.println("Welcome " + serverSession.getLogin());
		        //System.out.println("SessionID: " + SessionID); 
		        //out.append("Welcome " + serverSession.getLogin() + "\n");
		        
		        } catch (WebObjectsException ex) {
		            System.out.println(ex.getMessage());
		            ex.printStackTrace();
		            Log.logger.logp(Level.SEVERE, "GetReportDataTaskUserSession", "processRequest", ex.getMessage());
		        }		        
    
		}catch (WebObjectsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Log.logger.logp(Level.SEVERE, "GetReportDataTaskUserSession", "processRequest", e.getMessage());
		}
	 
		// Get Report Data Start
    	try {  
    	
    		// String strReportID = "23FEB36C4435174D9F397EB173482621";
    		String strReportID = objectID;
    		WebObjectSource oSource = objectFactory.getObjectSource();
		   
    		int PRETTY_PRINT_INDENT_FACTOR = 4;
		
			WebObjectInfo reportObject = oSource.getObject(strReportID, EnumDSSXMLObjectTypes.DssXmlTypeReportDefinition, true);
			WebReportSource reportSource=objectFactory.getReportSource();
			WebReportInstance reportInstance=null;
			reportInstance=reportSource.getNewInstance(reportObject.getID());
			reportInstance.setAsync(false);

		    int status = reportInstance.pollStatus();
		       		        
	        String XML1 = reportInstance.getResultsAsXML();
            // System.out.println("XML1 Result\n" + XML1);
		        
	        // Retrieve JSON using XML
			JSONObject xmlJSONObj = XML.toJSONObject(XML1);
			String jsonPrettyPrintString = xmlJSONObj.toString(PRETTY_PRINT_INDENT_FACTOR);
				
	 	    // System.out.println("jsonPrettyPrintString\n" + jsonPrettyPrintString);
		    out.append(jsonPrettyPrintString);
		    
		} catch (Exception ep) {
		   		ep.printStackTrace();
		   		Log.logger.logp(Level.SEVERE, "GetReportDataTaskUserSession", "processRequest", ep.getMessage());
		} 
    	
		 // Get Report Data End       
    }    
}