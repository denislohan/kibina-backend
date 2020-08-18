export default (err) =>{
    try{
        if(err['errors'])
            return err['errors'][0]['message'] 
        else if (err['error'])
            return err['parent']['message']
        
        return err['parent']['code'] 
    } catch(e){
        return e;
    }
    

  
}
