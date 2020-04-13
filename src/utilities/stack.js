/**
 * Object of the data structure Stack
 */
class _Stack {
	
	/**
	 * Creates an empty Stack, then, stacks all elements passed as parameters
	 * @param elements - All elements that will be stacked. It accepts any number of parameters. 
	 */
	constructor(){
		this.top = null;
		this.stack = {} 	
		this.multiPush(...arguments);
	}

	/**
	 * Pushes a single Object into the top of the stack.
	 * If you want to push multiple Objects, consider the multiPush method.
	 * @param {Object} element - The object that will be pushed into the stack;
	 */
	push(element){
		let randomlyGeneratedId = '_' + Math.random().toString(36).substr(2, 9);
		
		if(this.top)
			this.stack[this.top].next = randomlyGeneratedId;

		
		this.stack[randomlyGeneratedId] = {
			value: element,
			next: null,
			prev: this.top
		}

		this.top = randomlyGeneratedId;
		
	}

	/**
	 * Removes the element located on the top of the stack, returning it.
	 * @return {Object} The removed element.
	 */
	pop(){
		if(!this.top)
			return null
		
		let removedId = this.top; 
		this.top = this.stack[this.top].prev;
		
		let removedElement = {...this.stack[removedId]};
		delete this.stack[removedId];
		
		return removedElement.value;
	}

	/**
	 * Stacks all elements passed as parameters
	 * @param elements - All elements that will be stacked. It accepts any number of parameters. 
	 */
	multiPush(){
		for(let i = 0; i < arguments.length; i++){
			this.push(arguments[i]);
		}
	}

	/**
	 * Removes x elements from the top of the stack, returning an array containing them.
	 * @param numberOfPops - The number of elements to be removed.
	 * @returns {Array} All the elements removed, in order of remotion.
	 */
	multiPop(numberOfPops){
		let removedElements = [];

		for(let i = 0; i < numberOfPops; i++){
			removedElements.push(this.pop());
		}

		return removedElements;

	}

	/**
	 * Returns the element located at the top of the stack.
	 * @returns {Object} The element located at the top of the stack;
	 */
	getTop(){
		if(!this.stack[this.top])
			return null
		return this.stack[this.top].value;
	}

	/**
	 * Console logs all elements from the stack, from top to bottom, separated with a line break.
	 */
	print(){
		let current = this.top;
		while(current){
			current = this.stack[current].prev;	
		}
		
	}
}

export default _Stack;