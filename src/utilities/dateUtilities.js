const dateUtils = {
	getStringNoHours: function(milliseconds){
		const dateObj = new Date(milliseconds);
		return `${dateObj.getDate()<10?'0'+dateObj.getDate():dateObj.getDate()}/${dateObj.getMonth()+1<10?'0'+(dateObj.getMonth()+1):dateObj.getMonth()+1}/${dateObj.getFullYear()}`;
	},

	getStringWithHours: function(milliseconds){
		const dateObj = new Date(milliseconds);
		return `${dateObj.getDate()<10?'0'+dateObj.getDate():dateObj.getDate()}/${dateObj.getMonth()+1<10?'0'+(dateObj.getMonth()+1):dateObj.getMonth()+1}/${dateObj.getFullYear()}  às ${dateObj.getHours()<10?'0'+dateObj.getHours():dateObj.getHours()}:${dateObj.getMinutes()<10?'0'+dateObj.getMinutes():dateObj.getMinutes()}:${dateObj.getSeconds()<10?'0'+dateObj.getSeconds():dateObj.getSeconds()}`;
	},

	getRawStringWithHours: function(milliseconds){
		const dateObj = new Date(milliseconds);
		return `${dateObj.getDate()<10?'0'+dateObj.getDate():dateObj.getDate()}/${dateObj.getMonth()+1<10?'0'+(dateObj.getMonth()+1):dateObj.getMonth()+1}/${dateObj.getFullYear()} ${dateObj.getHours()<10?'0'+dateObj.getHours():dateObj.getHours()}:${dateObj.getMinutes()<10?'0'+dateObj.getMinutes():dateObj.getMinutes()}:${dateObj.getSeconds()<10?'0'+dateObj.getSeconds():dateObj.getSeconds()}`;
	},

	transformString: function(dateStr){
		const dateArr = dateStr.split('-');
		try{
			return `${dateArr[0]}/${dateArr[1]}/${dateArr[2]}` 
		}
		catch(e){
			return "Não foi possível mostrar a data."
		}
	}
}

export default dateUtils;