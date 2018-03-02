/* global cuid */

// eslint-disable-next-line no-unused-vars
const Item = (function(){

    const validateName = function(name) {
      if (!name) throw new TypeError('Name must not be blank');
    };
  
    const create = function(name, id=cuid()) {
      
      return {
        id: id,
        name,
        checked: false
      };
    };
  
    return {
      validateName,
      create,
    };
    
  }());
  