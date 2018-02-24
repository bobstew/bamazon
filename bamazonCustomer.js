var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Flybeast79!",
	database: "bamazon"
});

var execute = function(){

	connection.query("SELECT * FROM products", function(err, result) {
		return (theInventory(result));
	  
	  });

	setTimeout(function() {
	    prompt.get(['ItemID', 'Quantity'], function (err, result) {
	    	console.log(result)
		    var shopperItem = result.ItemID;
		    var shopperQuantity =result.Quantity;

		    inventoryCheck(shopperItem, shopperQuantity);
		    setTimeout(function() {execute();}, 3500);

		});
	}, 750);
}

// check inventory

var inventoryCheck = function (id, quantity){
	connection.query('SELECT * FROM products WHERE item_id = ' + id, function (err, result){
		if (err) throw err;

		var total = result[0].price * quantity;

		var inventory = result[0].stock_quantity - quantity;

		if (inventory < 0){
			console.log('Insufficient stock. There are only '+ result[0].stock_quantity + 'item(s) left.');
		} else {
			console.log('User has bought ' + quantity + ' ' + result[0].product_name + ' for $' + total);
			console.log('There are ' + inventory + ' ' + result[0].product_name + ' remaining.')
			databaseUpdate(id, inventory)
		}
	});
}

// update the db
var databaseUpdate = function(id, quantity){
	connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?' , [quantity, id], function(err, result) {
        if (err) throw err;
    });
}

// make invenory 

function theInventory(items){
	for (var i = 0; i < items.length; i++) {
		console.log('------------------------');
		console.log('ItemID: ' + items[i].item_id);
		console.log('Item: ' + items[i].product_name);
		console.log('Department: ' + items[i].department_name);
		console.log('Price: $' + items[i].price);
	}
	console.log('------------------------');
}


// connection to database
connection.connect(function(err) {
    if (err) {
		console.error('error connecting: ' + err);
	    return;
	}
});

// make it rain
execute();




