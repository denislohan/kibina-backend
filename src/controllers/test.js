class Test{

    test(req,res){

        // after communicating to and from the database 

      res.status(200).json({"status": 'Service is On'});
      return "Service is On"

    }
}

export default Test;