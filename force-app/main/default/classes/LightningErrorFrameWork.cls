public class LightningErrorFrameWork {
 public static string handleErrorMessage(String errorMessage)
    {
            String errorMsg = errorMessage.substringAfter('_EXCEPTION,');
            return errorMsg.Substring(0, (errorMsg.length()-4));
    }
}