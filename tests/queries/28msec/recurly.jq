jsoniq version "1.0";

declare %private %an:sequential function local:test($response as object()) as object()
{
  let $xml-response := 1
  return
  {|     
    {    
      "errors":  
      [    
        for $error in $xml-response/*:error 
        return
        {|   
          for $node in $error/@*
          return { fn:local-name($node) : data($node) },
          { "description": string($error) }
        |}   
      ]    
    },   
    
    let $transaction-error := $xml-response/*:transaction_error
    return 
      if ($transaction-error)
      then {"transactionError": recurly-api:json-result($transaction-error, ("merchant_message"))}
      else ()
  |}
};

1
