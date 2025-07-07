package backend.exception;

public class UserNotFoundExeption extends RuntimeException{
    public UserNotFoundExeption(Long id) {
        super("could not find id " + id);
    }
    public UserNotFoundExeption(String message){
        super(message);
    }
}
