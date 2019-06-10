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

package com.CustomSubscriptionEmailTask;

import java.util.Date;

import com.microstrategy.web.beans.BeanFactory;
import com.microstrategy.web.beans.MarkupOutput;
import com.microstrategy.web.beans.RWBean;
import com.microstrategy.web.beans.ReportBean;
import com.microstrategy.web.beans.RequestKeys;
import com.microstrategy.web.beans.SubscriptionBean;
import com.microstrategy.web.objects.EnumWebSubscriptionObjectTypes;
import com.microstrategy.web.objects.SimpleList;
import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectsException;
import com.microstrategy.web.objects.WebObjectsFactory;
import com.microstrategy.web.objects.WebPrompts;
import com.microstrategy.web.objects.WebReportInstance;
import com.microstrategy.web.objects.WebSubscription;
import com.microstrategy.web.objects.WebSubscriptionAddress;
import com.microstrategy.web.objects.WebSubscriptionContentFormat;
import com.microstrategy.web.objects.WebSubscriptionDeliveryModeEmailProperties;
import com.microstrategy.web.objects.WebSubscriptionDevice;
import com.microstrategy.web.objects.WebSubscriptionRecipientList;
import com.microstrategy.web.objects.WebSubscriptionTrigger;
import com.microstrategy.web.objects.WebSubscriptionsSource;
import com.microstrategy.web.objects.rw.RWInstance;
import com.microstrategy.web.tasks.AbstractBaseTask;
import com.microstrategy.web.tasks.TaskParameterMetadata;
import com.microstrategy.web.tasks.TaskRequestContext;
import com.microstrategy.webapi.EnumDSSXMLApplicationType;
import com.microstrategy.webapi.EnumDSSXMLSubscriptionDeliveryType;

public class CustomSubscriptionEmailTask extends AbstractBaseTask  {
	
	 private TaskParameterMetadata object_ID;
	 private TaskParameterMetadata object_Type;
	 private TaskParameterMetadata email_ID;
	 private TaskParameterMetadata promptXml;
	 private TaskParameterMetadata sessionState;
	 private TaskParameterMetadata export_Type;
	 private TaskParameterMetadata email_Subject;

    public CustomSubscriptionEmailTask() {
        super("Create subcription with Prompt and Email");
        // TODO Auto-generated method stub
        
        object_ID = addParameterMetadata("objectID", "Enter Report ID", true, null);
        object_Type = addParameterMetadata("objectType", "Enter object Type", true, 3);
        email_ID = addParameterMetadata("emailID","Enter Email ID", true, "");
        promptXml = addParameterMetadata("PromptXML", "Enter Prompt XML", true, "");     
        sessionState = addParameterMetadata("SessionState", "Enter valid session state.", true, "");
        email_Subject = addParameterMetadata("emailSubject", "Enter email Subject", true, "");
        export_Type = addParameterMetadata("ExportType", "Enter valid export type[excel or pdf].", true, "excel");
    }

    public void processRequest(TaskRequestContext context, MarkupOutput out) {
        // TODO Auto-generated method stub
        
    	//get Values from the request keys:
        RequestKeys keys = context.getRequestKeys();        
       
        String objectID = keys.getValue(object_ID.getName());
        
        String objectType = keys.getValue(object_Type.getName());        
        int objectTypeInt = Integer.parseInt(objectType);        
        
        String emailID = keys.getValue(email_ID.getName());
        String promptXmlStr =  keys.getValue(promptXml.getName());
        String sessionStateString = keys.getValue("SessionState");
        String exportType =keys.getValue(export_Type.getName());
        String emailSubject = keys.getValue(email_Subject.getName());
        
        if(!exportType.equalsIgnoreCase("pdf"))
        {
        	exportType="Excel";
        }
        System.out.println("EXPORT TYPE IS :- " +exportType);
        out.append("New Subscription: ");        
        out.append("\n"+ objectID + "\n");
        out.append("\n"+ objectTypeInt + "\n");        
        out.append("\n"+ emailID + "\n");
        out.append("\n" + emailSubject + "\n");
        out.append("\n"+ exportType + "\n");
        
       	String SessionID = "";
		//Restore session
		WebObjectsFactory objectFactory = WebObjectsFactory.getInstance();
		WebIServerSession serverSession = objectFactory.getIServerSession();
		System.out.println("Sessionstate; " + sessionStateString);

		try {
			// Restore the session
			serverSession.restoreState(sessionStateString);
			System.out.println("MySessionID: " + serverSession.getSessionID().subSequence(0, 32));		
			serverSession.setApplicationType(EnumDSSXMLApplicationType.DssXmlApplicationCustomApp);        

		    try {

		     // Create the session
		        SessionID = serverSession.getSessionID();
		        System.out.println("Welcome " + serverSession.getLogin());
		        System.out.println("SessionID: " + SessionID); 
		        out.append("Welcome " + serverSession.getLogin() + "\n");

		     // Get the WebSubscriptionsSource object and test by getting a count of subscriptions that were previously created
		        WebSubscriptionsSource wss = objectFactory.getSubscriptionsSource();
		        SimpleList wsList = wss.getSubscriptions();
		        int size = wsList.size();
		        System.out.println("Current number of subscriptions: " + size);
		        out.append("Current number of subscriptions: " + size);
		      } catch (WebObjectsException ex) {
		            System.out.println(ex.getMessage());
		            ex.printStackTrace();
		         }		        
    
		} catch (WebObjectsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	 
		 //------------  
		if(objectTypeInt ==55){
			 boolean successDocumentEmail = createEmailDocumentSubsPrompt(objectID, promptXmlStr, serverSession, emailID,emailSubject,exportType);
			 System.out.println("successDocumentEmail ? "+ successDocumentEmail);
			 if (successDocumentEmail){
			 	out.append("\n Email Sent Successfully");
			 }else
			 {
			 	out.append("\n Email was not sent");
			 }
		}else if(objectTypeInt ==3){
			 boolean successReportEmail = createEmailReportSubsPrompt(objectID, promptXmlStr, serverSession, emailID,emailSubject,exportType);
			 System.out.println("successReportEmail ? "+ successReportEmail);
			 if (successReportEmail){
			 	out.append("\nEmail Sent Successfully");
			 }else
			 {
			 	out.append("\nEmail was not sent");
			 }
		}
		
		//---------------          
    }
//---------------------------------------------------------------------------    
    

    public static boolean createEmailDocumentSubsPrompt(String documentID, String promptAnswerXML, WebIServerSession serverSession, String emailID,String emailSubject ,String exportType) {

     Date dt = new Date();

     try {
    	 
   	  //create new RWBean:
 	  RWBean rwb = (RWBean)BeanFactory.getInstance().newBean("RWBean");     
      rwb.setSessionInfo(serverSession); 

   	  //get the instance, answer prompts, make sure status is ready
   	  
   	  //set document ID   
      rwb.setObjectID(documentID);
   	
      RWInstance rwi = rwb.getRWInstance();
      rwi.setAsync(false);
      rwi.pollStatus();
      int status = rwi.getStatus();
      System.out.println("Current status of the rsdoc: "+ status);
   	
   	  WebPrompts prompts = rwi.getPrompts();
   	  prompts.populateAnswers(promptAnswerXML);
   	  prompts.validate();
   	  prompts.answerPrompts();
   	
   	  int newStatus = rwi.pollStatus();
   	  System.out.println("New status is: "+ newStatus);
   	
   	  SubscriptionBean sb= (SubscriptionBean)BeanFactory.getInstance().newBean("SubscriptionBean");
   	  sb.setSessionInfo(serverSession);
   	  sb.setContent(rwb);    
   	
   	  //set subscription content to report
   	  WebSubscription ws = sb.getSubscription();   
   	
   	  //set delivery mode
   	  ws.populate();
   	  ws.setDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);
   	  // webSubscription.setDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);
   	  ws.setSendNow(true);    
   	  ws.setName("MyEmailSub");
   	  WebSubscriptionDeliveryModeEmailProperties emailProps = (WebSubscriptionDeliveryModeEmailProperties)ws.getDeliveryMode();
      emailProps.setEmailSubject(emailSubject);
      System.out.println("\t\t Subject Line = " + emailProps.getEmailSubject() + "\n");
      System.out.println("TEST");
   	  WebSubscriptionsSource  wss = serverSession.getFactory().getSubscriptionsSource();
   	
   	  //set the content format to PDF. If this is not set, it will default to HTML format
   	  SimpleList formats = ws.getContent().getAvailableFormats();
   	  WebSubscriptionContentFormat format = null;
   	  for(int z=0;z<formats.size();z++){
   	      format = (WebSubscriptionContentFormat)formats.item(z);
   	     // System.out.println("format - " + format.getName());  
   	   System.out.println("format - " + format.getName());
    	  System.out.println("format selected  - " + exportType);
   	      if(format.getName().equalsIgnoreCase(exportType)){  
   	        ws.getContentProperties().setFormat(format);
   	      }
   	   }
   	    
   	   //set deliveryMode Properties:		    
   	   WebSubscriptionDeliveryModeEmailProperties wdp = (WebSubscriptionDeliveryModeEmailProperties) ws.getDeliveryMode();
   	
   	   WebSubscriptionTrigger triggers = wss.getTriggerByTimePatternWeekday(0);  // RJ
   	   ws.setTrigger(triggers);
   	    
   	   //------address1------
           
       SimpleList addresses = wss.getAddressesByDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);
       WebSubscriptionAddress defaultAddress = null;

       for (int i = 0; addresses != null && i < addresses.size(); i++) {
           	WebSubscriptionAddress address = (WebSubscriptionAddress) addresses.item(i);
               System.out.println("address  == " + address.toString() );          
                if (address.getValue().equalsIgnoreCase(emailID)) {
                   	defaultAddress = address;
            }
       }

       // if the user don't have an email address assign one
       if(defaultAddress == null) {
    	   defaultAddress = (WebSubscriptionAddress)wss.getNewObject(EnumWebSubscriptionObjectTypes.WEB_SUBSCRIPTION_ADDRESS);
           defaultAddress.setName("MyEmail");
           defaultAddress.setValue(emailID);
           System.out.println("Inside If - defaultAddress :- "+ defaultAddress.getValue());
           SimpleList devices = wss.getDevicesByDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);

           if (devices != null && devices.size() > 0) {
                defaultAddress.setDevice((WebSubscriptionDevice) devices.item(0));
            }
           
            defaultAddress.save();
       }

       WebSubscriptionRecipientList wrl = ws.getRecipients();
       System.out.println("defaultAddress :- "+ defaultAddress.getValue());
       wrl.addAddress(defaultAddress);
              
       //------address1------ 
               
       ws.setSendNow(true);
       ws.populate();
       ws.save();
               
       System.out.println("Successfully created subscription " + ws.getName());
       System.out.println("Email sent successfully.");
       
       // Delete it.
       ws.delete();   						
       System.out.println("Subscription Deleted.");
               
   	  } catch (Exception e) {
   	   e.printStackTrace();
   	   return false;
   	  }
     return true;
    }
    
//---------------------------------------------------------------------------
    
    public static boolean createEmailReportSubsPrompt(String reportID, String promptAnswerXML, WebIServerSession serverSession, String emailID,String emailSubject,String exportType) {

     Date dt = new Date();

     try {
   	  //create new ReportBean:   
   	  ReportBean rb = (ReportBean)BeanFactory.getInstance().newBean("ReportBean");
   	  rb.setSessionInfo(serverSession); 

   	  //get the instance, answer prompts, make sure status is ready
   	  //set Report ID   
   	  rb.setObjectID(reportID);
   	  WebReportInstance rpti = rb.getReportInstance();
   	  rpti.setAsync(false);
   	  rpti.pollStatus();
   	  int status = rpti.getStatus();
   	  System.out.println("Current status of the rsdoc: "+ status);
   	
   	  WebPrompts prompts = rpti.getPrompts();
   	  prompts.populateAnswers(promptAnswerXML);
   	  prompts.validate();
   	  prompts.answerPrompts();
   	
   	  int newStatus = rpti.pollStatus();
   	  System.out.println("New status is: "+ newStatus);
   	
   	  SubscriptionBean sb= (SubscriptionBean)BeanFactory.getInstance().newBean("SubscriptionBean");
   	  sb.setSessionInfo(serverSession);
   	  sb.setContent(rb);    
   	
   	  //set subscription content to report
   	  WebSubscription ws = sb.getSubscription();   
   	
   	  //set delivery mode
   	  ws.populate();
   	  ws.setDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);
   	  // webSubscription.setDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);
   	  ws.setSendNow(true);    
   	  ws.setName("MyEmailSub");
   	  WebSubscriptionDeliveryModeEmailProperties emailProps = (WebSubscriptionDeliveryModeEmailProperties)ws.getDeliveryMode();
      emailProps.setEmailSubject(emailSubject);
      System.out.println("\t\t Subject Line = " + emailProps.getEmailSubject() + "\n");
      System.out.println("TEST");
   	  WebSubscriptionsSource  wss = serverSession.getFactory().getSubscriptionsSource();
   	
   	  //set the content format to PDF. If this is not set, it will default to HTML format
   	  SimpleList formats = ws.getContent().getAvailableFormats();
   	  WebSubscriptionContentFormat format = null;
   	  for(int z=0;z<formats.size();z++){
   	      format = (WebSubscriptionContentFormat)formats.item(z);
   	     System.out.println("format - " + format.getName());
   	  System.out.println("format selected  - " + exportType);
   	      if(format.getName().equalsIgnoreCase(exportType)){  
   	        ws.getContentProperties().setFormat(format);
   	      }
   	   }
   	    
   	   //set deliveryMode Properties:		    
   	   WebSubscriptionDeliveryModeEmailProperties wdp = (WebSubscriptionDeliveryModeEmailProperties) ws.getDeliveryMode();
   	
   	   WebSubscriptionTrigger triggers = wss.getTriggerByTimePatternWeekday(0);  // RJ
   	   ws.setTrigger(triggers);
   	    
   	   //------address1------
           
       SimpleList addresses = wss.getAddressesByDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);
       WebSubscriptionAddress defaultAddress = null;

       for (int i = 0; addresses != null && i < addresses.size(); i++) {
           	WebSubscriptionAddress address = (WebSubscriptionAddress) addresses.item(i);
               System.out.println("address  == " + address.toString() );          
                if (address.getValue().equalsIgnoreCase(emailID)) {
                   	defaultAddress = address;
            }
       }

       // if the user don't have an email address assign one
       if(defaultAddress == null) {
    	   defaultAddress = (WebSubscriptionAddress)wss.getNewObject(EnumWebSubscriptionObjectTypes.WEB_SUBSCRIPTION_ADDRESS);
           defaultAddress.setName("MyEmail");
           defaultAddress.setValue(emailID);
           System.out.println("Inside If - defaultAddress :- "+ defaultAddress.getValue());
           SimpleList devices = wss.getDevicesByDeliveryMode(EnumDSSXMLSubscriptionDeliveryType.DssXmlDeliveryTypeEmail);

           if (devices != null && devices.size() > 0) {
                defaultAddress.setDevice((WebSubscriptionDevice) devices.item(0));
            }
           
            defaultAddress.save();
       }

       WebSubscriptionRecipientList wrl = ws.getRecipients();
       System.out.println("defaultAddress :- "+ defaultAddress.getValue());
       wrl.addAddress(defaultAddress);
              
       //------address1------ 
               
       ws.setSendNow(true);
       ws.populate();
       ws.save();
               
       System.out.println("Successfully created subscription " + ws.getName());
       System.out.println("Email sent successfully.");       
   	   // Delete it.
       ws.delete();
       System.out.println("Subscription Deleted.");        
   	  } catch (Exception e) {
   	   e.printStackTrace();
   	   return false;
   	  }
     return true;
    }

}