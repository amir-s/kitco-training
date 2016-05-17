function g() {
	console.log("this is from g: " + this.name)
}

function f () {
	console.log(this.name);
}
var obj = {
	name: 'Amir',
	sayHello: f
}


obj.sayHello();