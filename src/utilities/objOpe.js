const objOpe = {

	excludeOptions: function(originalOptions, excludedOptions){
		if(excludedOptions instanceof Array){
			let excludedValues = excludedOptions.filter((cur)=>cur).map((cur)=>cur.value);
			return originalOptions.filter((cur)=> excludedValues.indexOf(cur.value) == -1);
		}
		let excludedArr = [];
		for(let i in excludedOptions){
			excludedArr.push(excludedOptions[i]);
		}
		let excludedValues = excludedArr.filter((cur)=>cur).map((cur)=>cur.value);
		return originalOptions.filter((cur)=> excludedValues.indexOf(cur.value) == -1);
	},

	comparator: function(a,b){
		if(a.label < b.label) return -1
		if(a.label > b.label) return 1
		return 0
	}

}

export default objOpe;