const knex = require('../db/knex');

exports.insert = async (tableName, tableData) => {
	console.log("tableName", tableName);
	console.log("tableData", tableData);
	let obj = {
		error: null,
		data: null,
	};
	try {
		//console.log("query", knex.insert(tableData).into(tableName).select("*").toSQL());
		const data = await knex
			.insert(tableData)
			.into(tableName)
            .select('*')
		obj.data = data;
		return obj;
	} catch (error) {
		obj.error = error;
		return obj;
	}
};

exports.findById = async (tableName, id) => {
    let obj = {
		error: null,
		data: null,
	};
	try {
		const data = await knex(tableName)
			.where(id)
	
		obj.data = data;
		return obj;
	} catch (error) {
		obj.error = error;
		return obj;
	}
}

exports.list = async (tableName) => {
    let obj = {
		error: null,
		data: null,
	};
	let query = {
		isVisible: 0
	}
	try {
		const data = await knex(tableName)
		.where(query)
		obj.data = data;
		return obj;
	} catch (error) {
		obj.error = error;
		return obj;
	}
}

exports.update = async (tableName, query, updateData) => {
    let obj = {
		error: null,
		data: null
	};
	try {
		const data = await knex(tableName).where(query).update(updateData);
		obj.data = data;
		return (obj);
	} catch (error) {
		obj.error = error;
		return (obj);
	}
}

exports.deletedata = async (tableName, query) => {
    let obj = {
		error: null,
		data: null
	};
	try {
		const data = await knex(tableName).where(query).del();
		obj.data = data;
		return (obj);
	} catch (error) {
		obj.error = error;
		return (obj);
	}
}