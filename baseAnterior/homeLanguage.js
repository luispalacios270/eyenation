$( document ).ready(function() {
   var language = x=window.navigator.language||navigator.browserLanguage;

	switch(language) {
	    case "fr":
	        $("[data-inscription]").html("registration");	        
	        $("[data-login]").html("Connection");
	        $("[data-services]").html("services");
	        $("[data-documentation]").html("documentation");
	        $("[data-contact]").html("Contac");	       
	        break;
	    case "en":
	        
	        break;
	    default:
	        language = "fr";
	}

});
