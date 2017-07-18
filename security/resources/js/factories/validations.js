;( function( video911App ) {

    "use strict";

    video911App.factory("$validations", validations);

    function validations(){

	return {
		  phone : vPhone
		}
	}


	function vPhone(value){

		return /^(\+)?[0-9+]{7,}$/g.test(value);

	}


} )( video911App );


