public with sharing class PositionController
 { 
     //modified by vinaytest4
     public static List<Position__c> getAllPositions()
     { 
         return [SELECT Id, Name, Department__c, Pay_Grade__c, Salary_Range__c, Status__c FROM Position__c];
          
    } 
 }