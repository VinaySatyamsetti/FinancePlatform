public class Vinay {
    public static void createNewRecordInAccount(){
        Account acc = new Account();
        acc.Name = 'VinayTest';
        acc.Phone = '3142298466';
        acc.Industry = 'Banking';
        acc.Type = 'Prospect';
        insert acc;
        System.debug('Created account' + acc);
         }
    public static void createList(){
        List <String> stlLst = new List<String>();
        
        stlLst.add('Vinay');
        
        stlLst.add('Mohansb');
        
        stlLst.add('3456');
        
        System.debug('stlLst==>' + stlLst);
    }

     
}