/**
 * Object comparator module
 */
const objComp = {

	/**
	 * Compares two objects
	 * @param {Object} obj1 - The first compared object
	 * @param {Object} obj2 - The second compared object
	 */
	compareObj: function(obj1, obj2){
		if(typeof(obj1) != typeof(obj2)) return false;

		if(typeof(obj1) != 'object') return obj1 === obj2;

		let obj1Keys = [...Object.keys(obj1)];
		let obj2Keys = [...Object.keys(obj2)];		

		if(obj1Keys.length != obj2Keys.length) return false

		if(JSON.stringify(obj1) == JSON.stringify(obj2)) return true

		for(let i = 0; i< obj1Keys.length; i++){
			if(!obj2[obj1Keys[i]] || !this.compareObj(obj2[obj1Keys[i]], obj1[obj1Keys[i]]))  return false;
		}

		for(let i = 0; i< obj2Keys.length; i++){
			if(!obj1[obj2Keys[i]] || !this.compareObj(obj1[obj2Keys[i]], obj2[obj2Keys[i]])) return false;
		}
		
		return true;
	},

	/**
	 * Verifies if two arrays are the same, disregarding the order of its elements
	 * @param {Array} arr1 - The first compared array
	 * @param {Array} arr2 - The second compared array
	 */
	compareArrNonOrdered: function(arr1, arr2){
		if(arr1.length != arr2.length) return false;

		if(!this.arrayInAnother(arr1, arr2) || !this.arrayInAnother(arr2, arr1)) return false

		return true;
	},

	/**
	 * Verifies if two arrays are the same, including the order of its elements
	 * @param {Array} arr1 - The first compared array
	 * @param {Array} arr2 - The second compared array
	 */
	compareArrOrdered: function(arr1, arr2){
		if(arr1.length != arr2.length) return false;

		for(let i = 0; i < arr1.length; i++) 
			if(this.compareObj(arr1[i], arr2[i])) return false

		return true;
	},

	/**
	 * Verifies if an simple array contains another simple array
	 * @param {Array} contained - The array that is contained
	 * @param {Array} container - The array that contains
	 * @Notation contained ⊆ container
	 * @Contains: An array(container) contains another array(contained) ⟺ ∀ x ∈ contained, x ∈ container
	 * @SimpleArray: An array of non-strong objects
	 */
	arrayInAnother: function(contained, container){

		for(let i = 0; i < contained.length; i++ )
			if(container.indexOf(contained[i]) == -1) return false
		
		return true
	},

	/**
	 * Returns an object with the non-deletion differences between two strong objects assuming that one object is an unchanged version and the other is a changed version
	 * @param {Object} oldObj - The object without changes
	 * @param {Object} newObj - The object with changes
	 * @NonDeletionDifferenceBetweenObjects  { newObj.x | oldObj.x is undefined or newObj.x != oldObj.x }
	 * @StrongObject: An object of name obj is a strong object if and only if typeof(obj) returns object
	 */
	getDiffObj: function(oldObj, newObj){
		if(this.compareObj(oldObj, newObj)) return {};

		let difference = {}

		for(let i in newObj){
			if(!oldObj[i]) difference[i] = newObj[i];

			else if(typeof(oldObj[i]) == typeof(newObj[i]) && !this.compareObj(oldObj[i], newObj[i]) ) difference[i] = {...newObj[i]};
			
			else if(oldObj[i] != newObj[i]) difference[i] = newObj[i];
		}

		return difference;
	},

	/**
	 * Returns an array with the non-deletion differences between two arrays assuming that one array is an unchanged version and the other is a changed version
	 * @param {Object} oldArr - The array without changes
	 * @param {Object} newArr - The array with changes
	 * @NonDeletionDifferenceBetweenArrays  { x | x ∉ oldArr and x ∈ newArr }
	*/
	getDiffArr: function(oldArr, newArr){

		let difference = newArr.map((current)=>{
			let exists = false;
			let j = 0;
			while(!exists && j<oldArr.length){
				if(this.compareObj(current, oldArr[j])) exists = true;
				j++;
			}
			if(!exists) return {...current};
		});

		return difference.filter((value)=>{ return value != null});
	
	},

	/**
	 * Returns a String Array with the names of all properties that had its value changed on an object
	 * @param {Object} oldObj - The object without changes
	 * @param {Object} newObj - The object with changes
	 */
	getDiffPropNames: function(oldObj, newObj){

		let difference = [];

		for(let i in oldObj){
			if(!this.compareObj(oldObj[i], newObj[i])) difference.push(i);
		}

		return difference;
	},

	/**
	 * Returns a boolean that indicates whether an object is empty
	 * @param {Object} something - The object that will be tested
	 * @EmptyStrongObject An strong object is empty ⟺ the object has no properties
	 * @EmptyArray An array is empty ⟺ the array has no elements
	 * @EmptyPrimitive An primitive(x) is empty ⟺ !!(x) returns false
	 */
	isEmpty: function(something){
		if(!something) return true;
		if(something instanceof Array && something.length == 0) return true;
		if(something instanceof Array && something.length != 0) return false; 
		if(something instanceof Object){
			return Object.keys(something).length == 0
		}
		return false;
	}

}

export default objComp;

